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
        numAnnotations = annotations.length


        for (var i=0; i < numAnnotations; i++ ){
            var thisAnno = annotations[i]
            thisAnno.offsetTop = $(thisAnno.highlights[0]).offset().top
            var annoBottom$ = $(_.last(thisAnno.highlights))
            thisAnno.offsetBottom = annoBottom$.offset().top
                + annoBottom$.height()
        }

        $(window).scroll(function() {
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
