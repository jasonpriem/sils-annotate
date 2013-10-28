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

        var userToShow = false
        var focusedIds = {}

        var textContainters$ = $(".text-container")
        var displayStyles = ["hidden", "icons", "snippets", "full"]
        var nextDisplayStyle = {
            "icons": "snippets",
            "snippets": "full",
            "full": "full"
        }
        var snippetHeight = 30 // super brittle




        /***********************************************************************
         * functions
         **********************************************************************/

        var showCounts = function(){
          var annos = getAnnotationsFromSetOfHls($("html"))
          $(".submenu.annotations-count span.num").text(annos.length)

          var annosByUser = _.groupBy(annos, function(anno){return anno.userId})

          console.log(annosByUser)

          $(".submenu.users-count span.num").text(_.size(annosByUser))


        }

        var handleGlobalControls = function() {
            $("#menubar a.display-style").click(function(){
                var newState = _.intersection(displayStyles, this.className.split(" "))[0]
                changeGlobalDisplayState(newState)
            })

            $("#menubar ul.enable-disable-annotation a").click(function(){
                if ($(this).hasClass("disabled")) return false
                enableDisableAnnotation()
            })
        }


        var enableDisableAnnotation = function() {
            console.log("enabling/disabling annotations")
            enableAnnotation = !enableAnnotation
            $("#menubar ul.enable-disable-annotation a")
                .toggleClass("active")
                .toggleClass("ready")
        }

        var changeGlobalDisplayState = function(newState){

            if ($("#menubar a.hidden").hasClass("active")) enableDisableAnnotation()


            $("#menubar a.display-style")
                .removeClass("active")
                .filter("." + newState)
                .addClass("active")

            textContainters$
                .add("#scrollbar")
                .removeClass(displayStyles.join(" "))
                .addClass(newState)

            redrawAllAnnoPanes()

            // if annotations are hidden, you can't make new ones
            if ($("#menubar a.hidden").hasClass("active")) {
                $("#menubar ul.enable-disable-annotation a").addClass("disabled")
                if (enableAnnotation) {
                    enableDisableAnnotation()
                }
            }
            else {
                $("#menubar ul.enable-disable-annotation a").removeClass("disabled")
            }
        }

        var renderAnno = function(anno) {
            if (userToShow && userToShow != anno.userId) return false


            var idClass = "id-" + anno._id
            var annoLi$ = $('<li class="sils-anno '
                                + idClass
                                + ' ' + anno.userId
                                + '"><span class="text"><span class="username">'
                                + capitaliseFirstLetter(anno.userId)
                                + '</span></span><div class="mask"></div></li>')
            var userIconUrl = "/static/img/users/" + anno.userId + ".png"
            var userIcon = $('<img src="'+ userIconUrl +'">')
            annoLi$.prepend(userIcon)
            annoLi$.prepend("<div class='more-indicator'>+</div>")
            annoLi$.find("span.text").append(anno.text)
            annoLi$.hover(
                function(){
                    $("."+idClass)
                        .find(".annotator-hl")
                        .andSelf()
                        .addClass("active")
                        .parents("ul.sils-annos")
                        .addClass("active")
                    console.log("hoving to activate idClass", idClass)
                },
                function(){
                    $("."+idClass)
                        .find(".annotator-hl")
                        .andSelf()
                        .removeClass("active")
                        .parents("ul.sils-annos")
                        .removeClass("active")                }
            )
            return annoLi$

        }


        var annoFocus = function(elems) {
            if (!enableAnnotation) return false

            // add to the focusedIds array
            $(elems).each(function(){
                var thisId = readIdFromClassStr(this.className)
                focusedIds[thisId] = $('.annotator-hl.'+thisId).text().length
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


            $(".text-container .active, #scrollbar .active").removeClass("active")
            if (!shortestIds.length) return false
            var activeIdsSelector = "."+shortestIds.join(", .")
            $(activeIdsSelector).find(".annotator-hl").andSelf().addClass("active")
        }


        var annoBlur = function(e) {
            var annoId = readIdFromClassStr(e.className)
            delete focusedIds[annoId]
            activateShortestId()

        }

        function capitaliseFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
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

        var getAnnotationsFromSetOfHls = function(elem$) {
          var annos = {}
          elem$.find(".annotator-hl").each(function(){
              annos[readIdFromClassStr(this.className)] = $(this).data().annotation
          })
          return _.values(annos)
        }

        var writeAnnotationTexts = function() {

            var textContainerContents$ = $(
                "<div class='anno-display'>"
                    + "<ul class='container-states'>"
                            + "<li class='state icons'>Icons</li>"
                            + "<li class='sep'>&middot;</li>"
                            + "<li class='state snippets'>Snippets</li>"
                            + "<li class='sep'>&middot;</li>"
                            + "<li class='state full'>Full</li>"
                    + "</ul>"
                    + "<ul class='sils-annos'></ul>"
                + "</div>")
            textContainerContents$.find("li.state").click(function(){
                var parentContainer$ = $(this).parents(".text-container")
                var newState = _.intersection(
                    displayStyles,
                    this.className.split(" ")
                )[0]

                parentContainer$
                    .removeClass(displayStyles.join(" "))
                    .addClass(newState)

                redrawAnnoPane(parentContainer$)

            })



            textContainters$
                .append(textContainerContents$)
                .each(function(){
                    var annos = getAnnotationsFromSetOfHls($(this));
                    var renderedAnnosList$ = $(this).find("ul.sils-annos")
                    _.each(annos, function(anno){
                        var renderedAnno = renderAnno(anno)
                        renderedAnnosList$.append(renderedAnno)
                    })
                    if (annos.length === 0) $(this).addClass("no-annos")

                })


        }

        var redrawAnnoPane = function(container$) {
            var annoListHeight = container$.find("ul.sils-annos").height()
            if (annoListHeight > 0) annoListHeight += 30
            container$.css("min-height", annoListHeight + "px")
        }


        var redrawAllAnnoPanes = function(){
            textContainters$.each(function(){
                redrawAnnoPane($(this))
            })
            drawScrollbarBlocks()
            showCounts()
        }


        var drawScrollbarBlocks = function(){
            var scrollbarScaleFactor = $("#scrollbar").height() / $("html").height()
            $("#scrollbar").empty()
            $("span.annotator-hl").each(function(){
                var elem$ = $(this)
                var idClassName = readIdFromClassStr(this.className)
                $("<div class='scrollbar-block'></div>")
                    .css(
                    {
                        top: (elem$.offset().top * scrollbarScaleFactor) +"px",
                        height: (elem$.height() * scrollbarScaleFactor) + "px"
                    }
                )
                    .addClass(idClassName)
                    .appendTo("#scrollbar")
            })
        }

        var setHlClassNames = function() {
            $("span.annotator-hl").each(function(){

                // add an id- class
                var elem$ = $(this)
                var thisClassName = "id-" + elem$.data().annotation.id
                elem$.addClass(thisClassName)

                // add a nested-depth class
                var numHlParents = elem$.parents(".annotator-hl").length + 1
                if (numHlParents > 3) numHlParents = 3
                var nestedDepthClassName = "nested-"+numHlParents
                elem$.addClass(nestedDepthClassName)
                console.log(elem$[0].className)

            })

        }



        var markLongAnnotations = function() {
            $("li.sils-anno").each(function(){
                var this$ = $(this)
                var textHeight = this$.find("span.text")[0].clientHeight
                if (textHeight > snippetHeight) {
                    $(this).addClass("long")
                    if (textHeight > (snippetHeight + 13)) {
                        this$.addClass("extra-long")
                    }
                }
            })
        }

        var scrollbarClickChangesLocation = function(){
            $("#scrollbar").click(function(e){
                var percFromTop = (e.clientY / $(this).height()) * 100
                console.log("percent from top", percFromTop)

                $(document).scrollTo(percFromTop+"%", 500)
            })
        }

        var changeDisplayForTextContainers = function() {
            // @todo: totally broken; should use the writeAnnotations() function, which'd need
            // to be modified to take param of where.

            $(".annotator-hl").click(function(){

                $(this).parents(".text-container")
                    .removeClass(displayStyles.join(" "))
                    .addClass("snippets")
            })

        }









        /***********************************************************************
         * procedural code
         **********************************************************************/


        $(".annotator-hl").hover(
            function(){ annoFocus(this) },
            function(){ annoBlur(this) }
        )

        setHlClassNames()
        writeAnnotationTexts()
        handleGlobalControls()
        markLongAnnotations()
        scrollbarClickChangesLocation()
        redrawAllAnnoPanes()


    };

    return Scrollbar;

})(Annotator.Plugin);
