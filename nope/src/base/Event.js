np.define('np.Event', function() {
  'use strict';
  var Event,
      EventInterface;

  EventInterface = function(add, remove) {
    this.add = add;
    this.remove = remove;
  };

  Event = np.inherits(function(owner) {
    this.owner = owner;
    this.listener0 = null;
    this.listener1 = null;
    this.listeners = [];
    this.length = 0;
    this._interface = null;
  }, np.require('np.Disposable'));

  Event.prototype.getInterface = function() {
    if (!this._interface) {
      this._interface = new EventInterface(
        this.addListener.bind(this),
        this.removeListener.bind(this)
      );
    }
    return this._interface;
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

  Event.prototype.fire = function(event) {
    var i = 2;

    if (this.listener0) {
      this.listener0(event, this.owner);
    }
    if (this.listener1) {
      this.listener1(event, this.owner);
    }
    if (this.length > 2) {
      for (; i < this.listenerCount; i++) {
        this.listeners[i](event, this.owner);
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

  return Event;
});
