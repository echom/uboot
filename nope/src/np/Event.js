np.define('np.Event', (require) => {
  var Disposable = require('np.Disposable'),
      EMPTY = Object.freeze({});

  /**
   * An event listener function which will be invoked every time this event is
   * raised.
   * @callback np.Event~Listener
   * @param {object} evt - the event arguments
   * @param {object} src - the event's source
   */
  /**
   * An event remover function - when invoked - removes a previously registered
   * listener from the event. Note that each addition of a listener creates a
   * corresponding remover function.
   * @callback np.Event~Remover
   */


  /**
   * This class represents a single event (callback list).
   * @extends np.Disposable
   * @memberof np
   */
  class Event extends Disposable {

    /**
     * Returns the default empty event arguments which can be re-used in favor
     * of creating many empty objects. The empty event arguments cannot be
     * modified.
     * @type {object}
     */
    static get empty() { return EMPTY; }

    /**
     * Creates a new event which belongs to the provided owner object.
     * @param {*} owner - The owner object which will act as event source for
     *    this event
     */
    constructor(owner) {
      super();

      this._owner = owner || null;
      this._listener0 = null;
      this._listener1 = null;
      this._listeners = [];
      this._length = 0;
    }

    /**
     * Returns the number of currently registered listeners on this event.
     * @type {number}
     */
    get length() { return this._length; }

    /**
     * Adds a listener function to this event. An optional context may be
     * provided to which the listener function will be bound.
     * @param {np.Event~Listener} listener - the listener function
     * @param {object} [ctx] - an optional context object to bind the listener
     *    to
     * @return {np.Event~Remover} a function which removes the added listener
     *    from this event
     */
    on(listener, ctx) {
      var _listener = this._addListener(ctx ? listener.bind(ctx) : listener);
      return () => this._removeListener(_listener);
    }

    /**
     * Raises this event with the specified event arguments.
     * @param {object} evt - the event arguments
     */
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

    /**
     * Adds a listener function to this event.
     * @protected
     * @param {np.Event~Listener} listener - the listener function to add
     * @return {np.Event~Listener} the listener function
     */
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

    /**
     * Removes a listener function from this event.
     * @protected
     * @param {np.Event~Listener} - listener - the listener function to remove
     */
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

    /**
     * @inheritdoc
     */
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
