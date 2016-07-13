np.define('np.Event', function() {
  'use strict';
  var Disposable = np.require('np.Disposable'),
      Event;

  Event = np.inherits(function(owner) {
    Disposable.call(this);
    this.owner = owner;
    this.listener0 = null;
    this.listener1 = null;
    this.listeners = [];
    this.length = 0;
    this._interface = null;
  }, Disposable);

  Event.prototype.on = function(handler, ctx) {
    var that = this,
        _ctx = ctx || this,
        _handler = handler.bind(_ctx),
        unbind = function() { that.removeListener(_handler); };
    that.addListener(_handler);
    return unbind;
  };

  Event.prototype.addListener = function(listener) {
    if (this.length === 0) {
      this.listener0 = listener;
    } else if (this.length === 1) {
      this.listener1 = listener;
    }
    this.listeners.push(listener);
    this.length = this.listeners.length;

    return listener;
  };

  Event.prototype.removeListener = function(listener) {
    var index;

    if (this.length === 1 && this.listener0 === listener) {
      this.listener0 = null;
      this.listeners.length = 0;
    } else {
      index = this.listeners.indexOf(listener);
      if (index >= 0) {
        this.listeners.splice(index, 1);
        this.listener0 = this.listeners[0] || null;
        this.listener1 = this.listeners[1] || null;
      }
    }
    this.length = this.listeners.length;
  };

  Event.prototype.raise = function(event) {
    var i = 2;

    if (this.listener0) {
      this.listener0.call(null, event, this.owner);
    }
    if (this.listener1) {
      this.listener1.call(null, event, this.owner);
    }
    if (this.length > 2) {
      for (; i < this.listenerCount; i++) {
        this.listeners[i].call(null, event, this.owner);
      }
    }
  };

  Event.prototype._dispose = function() {
    this.listeners.length = 0;
    this.listener0 = null;
    this.listener1 = null;
    this.owner = null;
    this.length = 0;
  };

  Event.define = function(target, name) {

  };

  return Event;
});
