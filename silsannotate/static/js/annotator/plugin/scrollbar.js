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

        var findTopToCenterAnnoList = function() {
            var halfLensHeight = (lens.bottom - lens.top) / 2
            var heightOfTopShutter = $(".lens-shutter.top").height()
            var middleOfLensOffset = heightOfTopShutter + halfLensHeight

            var heightOfAnnoList = $()
        }

        var makeShutters = function(lens){
            var lensHight = lens.bottom - lens.top
            var shutter$ = $("<div class='lens-shutter'><div class='main'></div></div></div>")

            // insert the shutters that define the lens
            shutter$.clone().addClass("top").css(
                    "height",
                    (lens.top) + "px"
                )
                .append("<img class='bracket' src='../static/img/lens-bracket-top.png'>")
                .appendTo("body")

            shutter$.clone().addClass("bottom").css(
                    "height",
                    ($(window).height() - lens.bottom) + "px"
                )
                .append("<img class='bracket' src='../static/img/lens-bracket-bottom.png'>")
                .appendTo("body")
        }

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

        var filterByUserId = function(userId) {
            console.log("hide all the", userId)
            $("#filmstrip li.sils-anno").not("."+userId).hide()

        }

        var renderAnno = function(anno, scrollDir) {
            if (userToShow && userToShow != anno.userId) return false

            var annoLi$ = $('<li class="sils-anno ' + anno._id + ' ' + anno.userId + '"><span class="text"></span></li>')
            var userIconUrl = "/static/img/users/" + anno.userId + ".png"
            var userIcon = $('<img src="'+ userIconUrl +'">')
            userIcon.click(function(){
                filterByUserId(anno.userId)
            })
            annoLi$.prepend(userIcon)
            annoLi$.find("span.text").append(anno.text)
//            annoLi$.click()
            if (scrollDir == "down"){
                annoLi$.appendTo("#filmstrip ul.main")
            }
            else if (scrollDir == "up") {
                annoLi$.prependTo("#filmstrip ul.main")
            }

        }

        var addAnnoToPane = function(anno, scrollDir) {
            if (anno.active == true) {
                return true
            }
            else {
                renderAnno(anno, scrollDir)
                anno.active = true
            }
        }

        var removeAnnoFromPane = function(anno, scrollDir) {
            if (!anno.active) {
                return false
            }
            else {
                if (scrollDir == "down") {
                    $("#filmstrip li." + anno._id).remove()
                }
                else if (scrollDir == "up") {
                    $("#filmstrip li." + anno._id).remove()

                }
                anno.active = false
            }
        }

        var onScroll = function() {
            var scrollTop = $(document).scrollTop()
            var scrollDir = (lastScrollTop - scrollTop > 0) ? "up" : "down"

            for (var i=0; i < numAnnotations; i++ ){
                var thisAnno =  annotations[i]
                var topPosition = thisAnno.offsetTop - scrollTop
                var bottomPosition = thisAnno.offsetBottom - scrollTop

                if (bottomPosition > lens.top && topPosition < lens.bottom) {
                    addAnnoToPane(thisAnno, scrollDir)
                }
                else {
                    removeAnnoFromPane(thisAnno, scrollDir)
                }
            }
            lastScrollTop = scrollTop
        }





        /***********************************************************************
         * procedural code
         **********************************************************************/

        makeShutters(lens)

        for (var i=0; i < numAnnotations; i++ ){
            var thisAnno = annotations[i]
            thisAnno.offsetTop = $(thisAnno.highlights[0]).offset().top
            var annoBottom$ = $(_.last(thisAnno.highlights))
            thisAnno.offsetBottom = annoBottom$.offset().top
                + annoBottom$.height()
        }

        $(window).scroll(function() {
            onScroll()
        })


        $("div.annotator-wrapper").click(function(e){
//            console.log("from .annotator-wrapper click handler, lens:", lens)
            console.log(this)
            if (this.id == "filmstrip") return false

            var lensHeight = lens.bottom - lens.top

            if (typeof e.clientY === "undefined") return true
            if (!$(".annotator-editor").hasClass("annotator-hide")) return true


            lens.top = (e.clientY - (lensHeight / 2))
            lens.bottom =(e.clientY + (lensHeight / 2))


            $(".lens-shutter").remove()
            makeShutters(lens)
            onScroll()

        })



        $("span.annotator-hl").each(function(){
            var elem$ = $(this)
            $("<div class='scrollbar-block'></div>")
                .css(
                    {
                    top: (elem$.offset().top * scrollbarScaleFactor) +"px",
                    height: (elem$.height() * scrollbarScaleFactor) + "px"
                    }
                )
                .appendTo("#scrollbar")
        })

    };

    return Scrollbar;

})(Annotator.Plugin);
