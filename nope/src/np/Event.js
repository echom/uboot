np.define('np.Event', () => {
  'use strict';
  var Disposable = np.require('np.Disposable'),
      EMPTY = Object.freeze({});

  class Event extends Disposable {
    static get EMPTY() { return EMPTY; }

    constructor(owner) {
      super();

      this._owner = owner || null;
      this._listener0 = null;
      this._listener1 = null;
      this._listeners = [];
      this._length = 0;
    }

    get length() { return this._length; }

    on(listener, ctx) {
      var _listener = ctx ? listener.bind(ctx) : listener;
      this._addListener(_listener);
      return () => this._removeListener(_listener);
    }

    raise(evt) {
      var i = 2,
          _evt = evt || EMPTY,
          _src = this._owner;

      if (this._listener0) {
        this._listener0.call(null, _evt, _src);
      }
      if (this._listener1) {
        this._listener1.call(null, _evt, _src);
      }
      if (this._length > 2) {
        for (; i < this._length; i++) {
          this._listeners[i].call(null, _evt, _src);
        }
      }
    }

    _addListener(listener) {
      if (this._length === 0) {
        this._listener0 = listener;
      } else if (this._length === 1) {
        this._listener1 = listener;
      }
      this._listeners.push(listener);
      this._length = this._listeners.length;

      return listener;
    }

    _removeListener(listener) {
      var index;

      if (this._length === 1 && this._listener0 === listener) {
        this._listener0 = null;
        this._listeners.length = 0;
      } else {
        index = this._listeners.indexOf(listener);
        if (index >= 0) {
          this._listeners.splice(index, 1);
          this._listener0 = this._listeners[0] || null;
          this._listener1 = this._listeners[1] || null;
        }
      }
      this._length = this._listeners.length;
    }

    _dispose() {
      super._dispose();
      this._listeners.length = 0;
      this._listener0 = null;
      this._listener1 = null;
      this._owner = null;
      this._length = 0;
    }
  }

  return Event;
});
