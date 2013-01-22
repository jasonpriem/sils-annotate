var Annotator, g, util, _Annotator, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

util = {
  uuid: (function() {
    var counter;
    counter = 0;
    return function() {
      return counter++;
    };
  })(),
  getGlobal: function() {
    return (function() {
      return this;
    })();
  },
  maxZIndex: function($elements) {
    var all, el;
    all = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = $elements.length; _i < _len; _i++) {
        el = $elements[_i];
        if ($(el).css('position') === 'static') {
          _results.push(-1);
        } else {
          _results.push(parseInt($(el).css('z-index'), 10) || -1);
        }
      }
      return _results;
    })();
    return Math.max.apply(Math, all);
  },
  mousePosition: function(e, offsetEl) {
    var offset;
    offset = $(offsetEl).offset();
    return {
      top: e.pageY - offset.top,
      left: e.pageX - offset.left
    };
  },
  preventEventDefault: function(event) {
    return event != null ? typeof event.preventDefault === "function" ? event.preventDefault() : void 0 : void 0;
  }
};

_Annotator = this.Annotator;

Annotator = (function(_super) {

  __extends(Annotator, _super);

  Annotator.prototype.events = {
    ".annotator-adder button click": "onAdderClick",
    ".annotator-adder button mousedown": "onAdderMousedown",
    ".annotator-hl mouseover": "onHighlightMouseover",
    ".annotator-hl mouseout": "startViewerHideTimer"
  };

  Annotator.prototype.html = {
    adder: '<div class="annotator-adder"><button>' + _t('Annotate') + '</button></div>',
    wrapper: '<div class="annotator-wrapper"></div>'
  };

  Annotator.prototype.options = {
    readOnly: false
  };

  Annotator.prototype.plugins = {};

  Annotator.prototype.editor = null;

  Annotator.prototype.viewer = null;

  Annotator.prototype.selectedRanges = null;

  Annotator.prototype.mouseIsDown = false;

  Annotator.prototype.ignoreMouseup = false;

  Annotator.prototype.viewerHideTimer = null;

  function Annotator(element, options) {
    this.onDeleteAnnotation = __bind(this.onDeleteAnnotation, this);
    this.onEditAnnotation = __bind(this.onEditAnnotation, this);
    this.onAdderClick = __bind(this.onAdderClick, this);
    this.onAdderMousedown = __bind(this.onAdderMousedown, this);
    this.onHighlightMouseover = __bind(this.onHighlightMouseover, this);
    this.checkForEndSelection = __bind(this.checkForEndSelection, this);
    this.checkForStartSelection = __bind(this.checkForStartSelection, this);
    this.clearViewerHideTimer = __bind(this.clearViewerHideTimer, this);
    this.startViewerHideTimer = __bind(this.startViewerHideTimer, this);
    this.showViewer = __bind(this.showViewer, this);
    this.onEditorSubmit = __bind(this.onEditorSubmit, this);
    this.onEditorHide = __bind(this.onEditorHide, this);
    this.showEditor = __bind(this.showEditor, this);    Annotator.__super__.constructor.apply(this, arguments);
    this.plugins = {};
    if (!Annotator.supported()) return this;
    if (!this.options.readOnly) this._setupDocumentEvents();
    this._setupWrapper()._setupViewer()._setupEditor();
    this._setupDynamicStyle();
    this.adder = $(this.html.adder).appendTo(this.wrapper).hide();
  }

  Annotator.prototype._setupWrapper = function() {
    this.wrapper = $(this.html.wrapper);
    this.element.find('script').remove();
    this.element.wrapInner(this.wrapper);
    this.wrapper = this.element.find('.annotator-wrapper');
    return this;
  };

  Annotator.prototype._setupViewer = function() {
    var _this = this;
    this.viewer = new Annotator.Viewer({
      readOnly: this.options.readOnly
    });
    this.viewer.hide().on("edit", this.onEditAnnotation).on("delete", this.onDeleteAnnotation).addField({
      load: function(field, annotation) {
        if (annotation.text) {
          $(field).escape(annotation.text);
        } else {
          $(field).html("<i>" + (_t('No Comment')) + "</i>");
        }
        return _this.publish('annotationViewerTextField', [field, annotation]);
      }
    }).element.appendTo(this.wrapper).bind({
      "mouseover": this.clearViewerHideTimer,
      "mouseout": this.startViewerHideTimer
    });
    return this;
  };

  Annotator.prototype._setupEditor = function() {
    this.editor = new Annotator.Editor();
    this.editor.hide().on('hide', this.onEditorHide).on('save', this.onEditorSubmit).addField({
      type: 'textarea',
      label: _t('Comments') + '\u2026',
      load: function(field, annotation) {
        return $(field).find('textarea').val(annotation.text || '');
      },
      submit: function(field, annotation) {
        return annotation.text = $(field).find('textarea').val();
      }
    });
    this.editor.element.appendTo(this.wrapper);
    return this;
  };

  Annotator.prototype._setupDocumentEvents = function() {
    $(document).bind({
      "mouseup": this.checkForEndSelection,
      "mousedown": this.checkForStartSelection
    });
    return this;
  };

  Annotator.prototype._setupDynamicStyle = function() {
    var max, sel, style, x;
    style = $('#annotator-dynamic-style');
    if (!style.length) {
      style = $('<style id="annotator-dynamic-style"></style>').appendTo(document.head);
    }
    sel = '*' + ((function() {
      var _i, _len, _ref, _results;
      _ref = ['adder', 'outer', 'notice', 'filter'];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        x = _ref[_i];
        _results.push(":not(.annotator-" + x + ")");
      }
      return _results;
    })()).join('');
    max = util.maxZIndex($(document.body).find(sel));
    max = Math.max(max, 1000);
    style.text([".annotator-adder, .annotator-outer, .annotator-notice {", "  z-index: " + (max + 20) + ";", "}", ".annotator-filter {", "  z-index: " + (max + 10) + ";", "}"].join("\n"));
    return this;
  };

  Annotator.prototype.getSelectedRanges = function() {
    var browserRange, i, normedRange, r, ranges, rangesToIgnore, selection, _i, _len;
    selection = util.getGlobal().getSelection();
    ranges = [];
    rangesToIgnore = [];
    if (!selection.isCollapsed) {
      ranges = (function() {
        var _ref, _results;
        _results = [];
        for (i = 0, _ref = selection.rangeCount; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
          r = selection.getRangeAt(i);
          browserRange = new Range.BrowserRange(r);
          normedRange = browserRange.normalize().limit(this.wrapper[0]);
          if (normedRange === null) rangesToIgnore.push(r);
          _results.push(normedRange);
        }
        return _results;
      }).call(this);
      selection.removeAllRanges();
    }
    for (_i = 0, _len = rangesToIgnore.length; _i < _len; _i++) {
      r = rangesToIgnore[_i];
      selection.addRange(r);
    }
    return $.grep(ranges, function(range) {
      if (range) selection.addRange(range.toRange());
      return range;
    });
  };

  Annotator.prototype.createAnnotation = function() {
    var annotation;
    annotation = {};
    this.publish('beforeAnnotationCreated', [annotation]);
    return annotation;
  };

  Annotator.prototype.setupAnnotation = function(annotation, fireEvents) {
    var normed, normedRanges, r, root, _i, _j, _len, _len2, _ref;
    if (fireEvents == null) fireEvents = true;
    root = this.wrapper[0];
    annotation.ranges || (annotation.ranges = this.selectedRanges);
    normedRanges = [];
    _ref = annotation.ranges;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      r = _ref[_i];
      try {
        normedRanges.push(Range.sniff(r).normalize(root));
      } catch (e) {
        if (e instanceof Range.RangeError) {
          this.publish('rangeNormalizeFail', [annotation, r, e]);
        } else {
          throw e;
        }
      }
    }
    annotation.quote = [];
    annotation.ranges = [];
    annotation.highlights = [];
    for (_j = 0, _len2 = normedRanges.length; _j < _len2; _j++) {
      normed = normedRanges[_j];
      annotation.quote.push($.trim(normed.text()));
      annotation.ranges.push(normed.serialize(this.wrapper[0], '.annotator-hl'));
      $.merge(annotation.highlights, this.highlightRange(normed));
    }
    annotation.quote = annotation.quote.join(' / ');
    $(annotation.highlights).data('annotation', annotation);
    if (fireEvents) this.publish('annotationCreated', [annotation]);
    return annotation;
  };

  Annotator.prototype.updateAnnotation = function(annotation) {
    this.publish('beforeAnnotationUpdated', [annotation]);
    this.publish('annotationUpdated', [annotation]);
    return annotation;
  };

  Annotator.prototype.deleteAnnotation = function(annotation) {
    var h, _i, _len, _ref;
    _ref = annotation.highlights;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      h = _ref[_i];
      $(h).replaceWith(h.childNodes);
    }
    this.publish('annotationDeleted', [annotation]);
    return annotation;
  };

  Annotator.prototype.loadAnnotations = function(annotations) {
    var clone, loader,
      _this = this;
    if (annotations == null) annotations = [];
    loader = function(annList) {
      var n, now, _i, _len;
      if (annList == null) annList = [];
      now = annList.splice(0, 10);
      for (_i = 0, _len = now.length; _i < _len; _i++) {
        n = now[_i];
        _this.setupAnnotation(n, false);
      }
      if (annList.length > 0) {
        return setTimeout((function() {
          return loader(annList);
        }), 10);
      } else {
        return _this.publish('annotationsLoaded', [clone]);
      }
    };
    clone = annotations.slice();
    if (annotations.length) loader(annotations);
    return this;
  };

  Annotator.prototype.dumpAnnotations = function() {
    if (this.plugins['Store']) {
      return this.plugins['Store'].dumpAnnotations();
    } else {
      return console.warn(_t("Can't dump annotations without Store plugin."));
    }
  };

  Annotator.prototype.highlightRange = function(normedRange, cssClass) {
    var hl, node, white, _i, _len, _ref, _results;
    if (cssClass == null) cssClass = 'annotator-hl';
    white = /^\s*$/;
    hl = $("<span class='" + cssClass + "'></span>");
    _ref = normedRange.textNodes();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      node = _ref[_i];
      if (!white.test(node.nodeValue)) {
        _results.push($(node).wrapAll(hl).parent().show()[0]);
      }
    }
    return _results;
  };

  Annotator.prototype.highlightRanges = function(normedRanges, cssClass) {
    var highlights, r, _i, _len;
    if (cssClass == null) cssClass = 'annotator-hl';
    highlights = [];
    for (_i = 0, _len = normedRanges.length; _i < _len; _i++) {
      r = normedRanges[_i];
      $.merge(highlights, this.highlightRange(r, cssClass));
    }
    return highlights;
  };

  Annotator.prototype.addPlugin = function(name, options) {
    var klass, _base;
    if (this.plugins[name]) {
      console.error(_t("You cannot have more than one instance of any plugin."));
    } else {
      klass = Annotator.Plugin[name];
      if (typeof klass === 'function') {
        this.plugins[name] = new klass(this.element[0], options);
        this.plugins[name].annotator = this;
        if (typeof (_base = this.plugins[name]).pluginInit === "function") {
          _base.pluginInit();
        }
      } else {
        console.error(_t("Could not load ") + name + _t(" plugin. Have you included the appropriate <script> tag?"));
      }
    }
    return this;
  };

  Annotator.prototype.showEditor = function(annotation, location) {
    this.editor.element.css(location);
    this.editor.load(annotation);
    this.publish('annotationEditorShown', [this.editor, annotation]);
    return this;
  };

  Annotator.prototype.onEditorHide = function() {
    this.publish('annotationEditorHidden', [this.editor]);
    return this.ignoreMouseup = false;
  };

  Annotator.prototype.onEditorSubmit = function(annotation) {
    this.publish('annotationEditorSubmit', [this.editor, annotation]);
    if (annotation.ranges === void 0) {
      return this.setupAnnotation(annotation);
    } else {
      return this.updateAnnotation(annotation);
    }
  };

  Annotator.prototype.showViewer = function(annotations, location) {
    this.viewer.element.css(location);
    this.viewer.load(annotations);
    return this.publish('annotationViewerShown', [this.viewer, annotations]);
  };

  Annotator.prototype.startViewerHideTimer = function() {
    if (!this.viewerHideTimer) {
      return this.viewerHideTimer = setTimeout(this.viewer.hide, 250);
    }
  };

  Annotator.prototype.clearViewerHideTimer = function() {
    clearTimeout(this.viewerHideTimer);
    return this.viewerHideTimer = false;
  };

  Annotator.prototype.checkForStartSelection = function(event) {
    if (!(event && this.isAnnotator(event.target))) {
      this.startViewerHideTimer();
      return this.mouseIsDown = true;
    }
  };

  Annotator.prototype.checkForEndSelection = function(event) {
    var container, range, _i, _len, _ref;
    this.mouseIsDown = false;
    if (this.ignoreMouseup) return;
    this.selectedRanges = this.getSelectedRanges();
    _ref = this.selectedRanges;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      range = _ref[_i];
      container = range.commonAncestor;
      if ($(container).hasClass('annotator-hl')) {
        container = $(container).parents('[class^=annotator-hl]')[0];
      }
      if (this.isAnnotator(container)) return;
    }
    if (event && this.selectedRanges.length) {
      return this.adder.css(util.mousePosition(event, this.wrapper[0])).show();
    } else {
      return this.adder.hide();
    }
  };

  Annotator.prototype.isAnnotator = function(element) {
    return !!$(element).parents().andSelf().filter('[class^=annotator-]').not(this.wrapper).length;
  };

  Annotator.prototype.onHighlightMouseover = function(event) {
    var annotations;
    this.clearViewerHideTimer();
    if (this.mouseIsDown || this.viewer.isShown()) return false;
    annotations = $(event.target).parents('.annotator-hl').andSelf().map(function() {
      return $(this).data("annotation");
    });
    return this.showViewer($.makeArray(annotations), util.mousePosition(event, this.wrapper[0]));
  };

  Annotator.prototype.onAdderMousedown = function(event) {
    if (event != null) event.preventDefault();
    return this.ignoreMouseup = true;
  };

  Annotator.prototype.onAdderClick = function(event) {
    var highlights, position, r, ranges;
    if (event != null) event.preventDefault();
    position = this.adder.position();
    this.adder.hide();
    if (this.selectedRanges && this.selectedRanges.length) {
      ranges = (function() {
        var _i, _len, _ref, _results;
        _ref = this.selectedRanges;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          r = _ref[_i];
          _results.push(Range.sniff(r).normalize());
        }
        return _results;
      }).call(this);
      highlights = this.highlightRanges(ranges, 'annotator-hl annotator-hl-temporary');
      this.editor.element.one('hide', function() {
        var h, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = highlights.length; _i < _len; _i++) {
          h = highlights[_i];
          _results.push($(h).replaceWith(h.childNodes));
        }
        return _results;
      });
    }
    return this.showEditor(this.createAnnotation(), position);
  };

  Annotator.prototype.onEditAnnotation = function(annotation) {
    var offset;
    offset = this.viewer.element.position();
    this.viewer.hide();
    return this.showEditor(annotation, offset);
  };

  Annotator.prototype.onDeleteAnnotation = function(annotation) {
    this.viewer.hide();
    return this.deleteAnnotation(annotation);
  };

  return Annotator;

})(Delegator);

Annotator.Plugin = (function(_super) {

  __extends(Plugin, _super);

  function Plugin(element, options) {
    Plugin.__super__.constructor.apply(this, arguments);
  }

  Plugin.prototype.pluginInit = function() {};

  return Plugin;

})(Delegator);

g = util.getGlobal();

if (!(((_ref = g.document) != null ? _ref.evaluate : void 0) != null)) {
  $.getScript('http://assets.annotateit.org/vendor/xpath.min.js');
}

if (!(g.getSelection != null)) {
  $.getScript('http://assets.annotateit.org/vendor/ierange.min.js');
}

if (!(g.JSON != null)) {
  $.getScript('http://assets.annotateit.org/vendor/json2.min.js');
}

Annotator.$ = $;

Annotator.Delegator = Delegator;

Annotator.Range = Range;

Annotator._t = _t;

Annotator.supported = function() {
  return (function() {
    return !!this.getSelection;
  })();
};

Annotator.noConflict = function() {
  util.getGlobal().Annotator = _Annotator;
  return this;
};

$.plugin('annotator', Annotator);

this.Annotator = Annotator;
