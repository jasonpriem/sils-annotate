var Delegator,
  __slice = Array.prototype.slice,
  __hasProp = Object.prototype.hasOwnProperty;

Delegator = (function() {

  Delegator.prototype.events = {};

  Delegator.prototype.options = {};

  Delegator.prototype.element = null;

  function Delegator(element, options) {
    this.options = $.extend(true, {}, this.options, options);
    this.element = $(element);
    this.on = this.subscribe;
    this.addEvents();
  }

  Delegator.prototype.addEvents = function() {
    var event, functionName, sel, selector, _i, _ref, _ref2, _results;
    _ref = this.events;
    _results = [];
    for (sel in _ref) {
      functionName = _ref[sel];
      _ref2 = sel.split(' '), selector = 2 <= _ref2.length ? __slice.call(_ref2, 0, _i = _ref2.length - 1) : (_i = 0, []), event = _ref2[_i++];
      _results.push(this.addEvent(selector.join(' '), event, functionName));
    }
    return _results;
  };

  Delegator.prototype.addEvent = function(bindTo, event, functionName) {
    var closure, isBlankSelector,
      _this = this;
    closure = function() {
      return _this[functionName].apply(_this, arguments);
    };
    isBlankSelector = typeof bindTo === 'string' && bindTo.replace(/\s+/g, '') === '';
    if (isBlankSelector) bindTo = this.element;
    if (typeof bindTo === 'string') {
      this.element.delegate(bindTo, event, closure);
    } else {
      if (this.isCustomEvent(event)) {
        this.subscribe(event, closure);
      } else {
        $(bindTo).bind(event, closure);
      }
    }
    return this;
  };

  Delegator.prototype.isCustomEvent = function(event) {
    event = event.split('.')[0];
    return $.inArray(event, Delegator.natives) === -1;
  };

  Delegator.prototype.publish = function() {
    this.element.triggerHandler.apply(this.element, arguments);
    return this;
  };

  Delegator.prototype.subscribe = function(event, callback) {
    var closure;
    closure = function() {
      return callback.apply(this, [].slice.call(arguments, 1));
    };
    closure.guid = callback.guid = ($.guid += 1);
    this.element.bind(event, closure);
    return this;
  };

  Delegator.prototype.unsubscribe = function() {
    this.element.unbind.apply(this.element, arguments);
    return this;
  };

  return Delegator;

})();

Delegator.natives = (function() {
  var key, specials, val;
  specials = (function() {
    var _ref, _results;
    _ref = jQuery.event.special;
    _results = [];
    for (key in _ref) {
      if (!__hasProp.call(_ref, key)) continue;
      val = _ref[key];
      _results.push(key);
    }
    return _results;
  })();
  return "blur focus focusin focusout load resize scroll unload click dblclick\nmousedown mouseup mousemove mouseover mouseout mouseenter mouseleave\nchange select submit keydown keypress keyup error".split(/[^a-z]+/).concat(specials);
})();
