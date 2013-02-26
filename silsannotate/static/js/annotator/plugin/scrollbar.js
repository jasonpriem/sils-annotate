var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Annotator.Plugin.Scrollbar = (function(_super) {

    __extends(Scrollbar, _super);

    Scrollbar.prototype.events = {
        'annotationsLoaded': 'updateScrollbar'
//        ,'annotationCreated': 'updateScrollbar'
    };

    function Scrollbar(element, options) {
        this.updateScrollbar = __bind(this.updateScrollbar, this);
        Scrollbar.__super__.constructor.apply(this, arguments);
    }

    Scrollbar.prototype.updateScrollbar = function(annotations) {
        var numAnnotations
        var annoWindow = {top: 200, bottom: 400}
        numAnnotations = annotations.length

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
            var annoLi$ = $('<li class="sils-anno"><span class="text"></span></li>')
            var userIconUrl = "/static/img/users/" + anno.userId + ".jpg"
            var userIcon = '<img src="'+ userIconUrl +'">'
            annoLi$.prepend(userIcon)
            annoLi$.find("span.text").append(anno.text)
            annoLi$.appendTo("#filmstrip ul.main")

        }

        var addAnnoToPane = function(anno) {
            if (anno.active == true) {
                return true
            }
            else {
                renderAnno(anno)
                anno.active = true
            }
        }

        var removeAnnoFromPane = function(anno) {
            if (!anno.active) {
                return false
            }
            else {
                console.log("remove this anno from the panel!", anno)
                anno.active == false
            }
        }


        for (var i=0; i < numAnnotations; i++ ){
            var thisAnno = annotations[i]
            thisAnno.offsetTop = $(thisAnno.highlights[0]).offset().top
            var annoBottom$ = $(_.last(thisAnno.highlights))
            thisAnno.offsetBottom = annoBottom$.offset().top
                + annoBottom$.height()
        }

        $(window).scroll(function() {
            var scrollTop = $(document).scrollTop()
            for (var i=0; i < numAnnotations; i++ ){
                var thisAnno =  annotations[i]
                var topPosition = thisAnno.offsetTop - scrollTop
                var bottomPosition = thisAnno.offsetBottom - scrollTop

                if (bottomPosition > annoWindow.top && topPosition < annoWindow.bottom) {
                    addAnnoToPane(thisAnno)
                }
                else {
                    removeAnnoFromPane(thisAnno)
                }
            }
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
