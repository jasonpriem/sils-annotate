var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Annotator.Editor = (function(_super) {

  __extends(Editor, _super);

  Editor.prototype.events = {
    "form submit": "submit",
    ".annotator-save click": "submit",
    ".annotator-cancel click": "hide",
    ".annotator-cancel mouseover": "onCancelButtonMouseover",
    "textarea keydown": "processKeypress"
  };

  Editor.prototype.classes = {
    hide: 'annotator-hide',
    focus: 'annotator-focus'
  };

  Editor.prototype.html = "<div class=\"annotator-outer annotator-editor\">\n  <form class=\"annotator-widget\">\n    <ul class=\"annotator-listing\"></ul>\n    <div class=\"annotator-controls\">\n      <a href=\"#cancel\" class=\"annotator-cancel\">" + _t('Cancel') + "</a>\n<a href=\"#save\" class=\"annotator-save annotator-focus\">" + _t('Save') + "</a>\n    </div>\n  </form>\n</div>";

  Editor.prototype.options = {};

  function Editor(options) {
    this.onCancelButtonMouseover = __bind(this.onCancelButtonMouseover, this);
    this.processKeypress = __bind(this.processKeypress, this);
    this.submit = __bind(this.submit, this);
    this.load = __bind(this.load, this);
    this.hide = __bind(this.hide, this);
    this.show = __bind(this.show, this);    Editor.__super__.constructor.call(this, $(this.html)[0], options);
    this.fields = [];
    this.annotation = {};
  }

  Editor.prototype.show = function(event) {
    util.preventEventDefault(event);
    this.element.removeClass(this.classes.hide);
    this.element.find('.annotator-save').addClass(this.classes.focus);
    this.checkOrientation();
    this.element.find(":input:first").focus();
//    this.setupDraggables();
    return this.publish('show');
  };

  Editor.prototype.hide = function(event) {

    console.log("hide!")
    util.preventEventDefault(event);
    this.element.addClass(this.classes.hide);
    return this.publish('hide');
  };

  Editor.prototype.load = function(annotation) {
    var field, _i, _len, _ref;
    this.annotation = annotation;
    this.publish('load', [this.annotation]);
    _ref = this.fields;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      field = _ref[_i];
      field.load(field.element, this.annotation);
    }
    return this.show();
  };

  Editor.prototype.submit = function(event) {
    var field, _i, _len, _ref;


    console.log("submit!")
    util.preventEventDefault(event);
    _ref = this.fields;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      field = _ref[_i];

      console.log("submitting this annotation: ", this.annotation)
      console.log("submitting this field: ", field.element)


      field.submit(field.element, this.annotation);
    }
    this.publish('save', [this.annotation]);
    return this.hide();
  };

  Editor.prototype.addField = function(options) {
    var element, field, input;
    field = $.extend({
      id: 'annotator-field-' + util.uuid(),
      type: 'input',
      label: '',
      load: function() {},
      submit: function() {}
    }, options);
    input = null;
    element = $('<li class="annotator-item" />');
    field.element = element[0];
    switch (field.type) {
      case 'textarea':
        input = $('<textarea />');
        break;
      case 'input':
      case 'checkbox':
        input = $('<input />');
    }
    element.append(input);
    input.attr({
      id: field.id,
      placeholder: field.label
    });
    if (field.type === 'checkbox') {
      input[0].type = 'checkbox';
      element.addClass('annotator-checkbox');
      element.append($('<label />', {
        "for": field.id,
        html: field.label
      }));
    }
    this.element.find('ul:first').append(element);
    this.fields.push(field);
    return field.element;
  };

  Editor.prototype.checkOrientation = function() {
    var controls, list;
    Editor.__super__.checkOrientation.apply(this, arguments);
    list = this.element.find('ul');
    controls = this.element.find('.annotator-controls');
    if (this.element.hasClass(this.classes.invert.y)) {
      controls.insertBefore(list);
    } else if (controls.is(':first-child')) {
      controls.insertAfter(list);
    }
    return this;
  };

  Editor.prototype.processKeypress = function(event) {
    if (event.keyCode === 27) {
      return this.hide();
    } else if (event.keyCode === 13 && !event.shiftKey) {
      return this.submit();
    }
  };

  Editor.prototype.onCancelButtonMouseover = function() {
    return this.element.find('.' + this.classes.focus).removeClass(this.classes.focus);
  };


  return Editor;

})(Annotator.Widget);
