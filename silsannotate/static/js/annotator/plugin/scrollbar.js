var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

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

            var annoLi$ = $('<li class="sils-anno ' + anno._id + ' ' + anno.userId + '"><span class="text"></span></li>')
            var userIconUrl = "/static/img/users/" + anno.userId + ".png"
            var userIcon = $('<img src="'+ userIconUrl +'">')
            annoLi$.prepend(userIcon)
            annoLi$.find("span.text").append(anno.text)
            return annoLi$

        }


        var annoFocus = function(e) {
            var annoId = readIdFromClassStr(e.className)
            $("."+annoId).addClass("active")
            unActivateParentspans()
        }

        var annoBlur = function(e) {
            var annoId = readIdFromClassStr(e.className)
            $("."+annoId).removeClass("active")
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

        var unActivateParentspans = function(){

            // find which unique annotations are highlighted
            var activeAnnos = {}

            $(".active").each(function(){
                var annoId = readIdFromClassStr(this.className)
                if (activeAnnos[annoId]) {
                    activeAnnos[annoId] += $(this).text().length
                }
                else {
                    activeAnnos[annoId] = $(this).text().length
                }
            })

            // figure out how many characters are highlighted for each active anno
            var annoPairs = _.pairs(activeAnnos)
            var topPairs = _.filter(annoPairs, function(){})


        }

        var numCharsInClass = function(className) {

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
                                    console.log(anno)
                                    renderedAnnosList$.append(renderedAnno)
                                })




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

            elem$.hover(
                function(){ annoFocus(this) },
                function(){ annoBlur(this) }
            )
        })

        writeAnnotationTexts()

    };

    return Scrollbar;

})(Annotator.Plugin);
