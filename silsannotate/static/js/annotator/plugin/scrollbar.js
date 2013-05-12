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





        /***********************************************************************
         * procedural code
         **********************************************************************/


        for (var i=0; i < numAnnotations; i++ ){

            var thisAnno = annotations[i]
            if (!thisAnno.highlights[0]) continue

            thisAnno.offsetTop = $(thisAnno.highlights[0]).offset().top
            var annoBottom$ = $(_.last(thisAnno.highlights))
            thisAnno.offsetBottom = annoBottom$.offset().top
                + annoBottom$.height()
        }



        $("span.annotator-hl").each(function(){
            var elem$ = $(this)
            elem$.addClass(elem$.data().annotation.id)
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
