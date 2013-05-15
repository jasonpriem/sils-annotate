var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };


var focusedIds = {}

Annotator.Plugin.Scrollbar = (function(_super) {

    __extends(Scrollbar, _super);

    Scrollbar.prototype.events = {
        'annotationsLoaded': 'updateScrollbar'
    };

    function Scrollbar(element, options) {
        this.updateScrollbar = __bind(this.updateScrollbar, this);
        Scrollbar.__super__.constructor.apply(this, arguments);
    }

    Scrollbar.prototype.updateScrollbar = function(annotations) {

        var numAnnotations
        var lastScrollTop = 0
        var userToShow = false

        // lens is global on purpose, easier debugging...
        lens = {top: 200, bottom: 400}
        var viewportHeight = $(window).height()
        numAnnotations = annotations.length





        /***********************************************************************
         * functions
         **********************************************************************/


        var changeHighlightBackgrounds = function(anno, active) {
            var numHighlights = anno.highlights.length
            var activeClass = "active"
            for (var i=0; i < numHighlights; i++ ) {
                if (active) {
                    $(anno.highlights[i]).addClass(activeClass)
                }
                else {
                    $(anno.highlights[i]).removeClass(activeClass)
                }
            }
        }

        var renderAnno = function(anno) {
            if (userToShow && userToShow != anno.userId) return false


            var idClass = "id-" + anno._id
            var annoLi$ = $('<li class="sils-anno ' + idClass + ' ' + anno.userId + '"><span class="text"></span></li>')
            var userIconUrl = "/static/img/users/" + anno.userId + ".png"
            var userIcon = $('<img src="'+ userIconUrl +'">')
            annoLi$.prepend(userIcon)
            annoLi$.find("span.text").append(anno.text)
            annoLi$.hover(
                function(){$("."+idClass).addClass("active")},
                function(){$("."+idClass).removeClass("active")}
            )
            return annoLi$

        }


        var annoFocus = function(elems) {

            // add to the focusedIds array
            $(elems).each(function(){
                var thisId = readIdFromClassStr(this.className)
                focusedIds[thisId] = $('.'+thisId).text().length
            })

            activateShortestId()

            return false
        }

        var activateShortestId = function(){
            // find which ids have the shortest length (array b/c ties are allowed)
            var shortestIds = []
            var shortestLenSoFar = Infinity
            _.each(focusedIds, function(len, id){
                if (len < shortestLenSoFar) {
                    shortestLenSoFar = len
                    shortestIds = [id]
                }
                else if (len == shortestLenSoFar) {
                    shortestIds.push(id)
                }
            })

            console.log("shortestIds", shortestIds)
            $(".active").removeClass("active")
            if (!shortestIds.length) return false
            $("."+shortestIds.join(" .")).addClass("active")
        }


        var annoBlur = function(e) {
            var annoId = readIdFromClassStr(e.className)
            console.log("focusedIds before blur action:", focusedIds)
            delete focusedIds[annoId]
            activateShortestId()
            console.log("focusedIds antes de blur action:", focusedIds)

        }

        var readIdFromClassStr = function(classStr, removePrefix) {
            var re = /id-(\w+)/
            var ret = false
            if (re.test(classStr)) {
                if (removePrefix) {
                    return re.exec(classStr)[1]
                }
                else {
                    return re.exec(classStr)[0]
                }
            }
            return ret
        }

        var annoIdsWithSmallestTexts = function(ids){
            var shortestIds = []
            var shortestLenSoFar = Infinity
            _.each(ids, function(id){
                var len = $(".annotator-hl "+id).text().length
                if (len < shortestLenSoFar) {
                    shortestLenSoFar = len
                    shortestIds = [id]
                }
                else if (len == shortestLenSoFar) {
                    shortestIds.push(id)
                }
            })

            console.log("shortestIds", shortestIds)
            return shortestIds
        }

        var unActivateParentspans = function(){

            // find which unique annotations are highlighted
            var contentLengths = {}

            $(".active .annotator-hl").each(function(){

                var annoId = readIdFromClassStr(this.className)
                var thisLength = $(this).text().length

                if (contentLengths[thisLength]) { // we've found something with length before
                    contentLengths[thisLength].push(annoId)
                }
                else { // we've never seen something of this length
                    contentLengths[thisLength] = [annoId]
                }
            })

            // find the shortest contentLength, and its associate IDs
            var shortest = _.min(_.pairs(contentLengths), function(x){ return x[0]})
            var shortestIDs = _.uniq(shortest[1])
            console.log(shortestIDs)

            $(".active .annotator-hl").each(function(){
                this$ = $(this)
                if (this$.hasClass(shortestIDs)) {
                    this$.removeClass("active")
                }
            })

        }



        var findsSmallestPair = function(className) {

        }

        var getAnnotationsFromSetOfHls = function(elem$) {
            var annos = {}
            elem$.find(".annotator-hl").each(function(){
                annos[readIdFromClassStr(this.className)] = $(this).data().annotation
            })
            return _.values(annos)
        }

        var writeAnnotationTexts = function() {
            $("h1,h2,h3,h4,h5,h6,p")
                .append("<div class='anno-display'><ul class='sils-annos'></ul></div>")
                .each(function(){
                    var annos = getAnnotationsFromSetOfHls($(this));
                    var renderedAnnosList$ = $(this).find("ul.sils-annos")
                    _.each(annos, function(anno){
                        var renderedAnno = renderAnno(anno)
                        renderedAnnosList$.append(renderedAnno)
                    })

                    // make sure there's room for all the rendered annotations
                    $(this).css({"min-height": renderedAnnosList$.height() + "px"})



                })



        }







        /***********************************************************************
         * procedural code
         **********************************************************************/

        $("span.annotator-hl").each(function(){
            var elem$ = $(this)

            // add the annotation ID as a class
            elem$.addClass("id-" + elem$.data().annotation.id)

            // draw a line on the scrollbar
            $("<div class='scrollbar-block'></div>")
                .css(
                    {
                    top: (elem$.offset().top * scrollbarScaleFactor) +"px",
                    height: (elem$.height() * scrollbarScaleFactor) + "px"
                    }
                )
                .appendTo("#scrollbar")
        })

        $(".annotator-hl").hover(
            function(){ annoFocus(this) },
            function(){ annoBlur(this) }
        )

        writeAnnotationTexts()

    };

    return Scrollbar;

})(Annotator.Plugin);
