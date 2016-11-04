np.define('np.Observable', (require) => {
  var Disposable = require('np.Disposable'),
      Event = require('np.Event');

  /**
   * @typedef np.Observable~ChangedEventArgs
   * @property {*} value - the new value
   */

  /**
   * An event listener function which will be invoked every time this event is
   * raised.
   * @callback np.Observable~ChangedEventListener
   * @param {ChangeEventArgs} evt - the event arguments
   * @param {object} src - the event's source
   */

  /**
   * Observable wraps a value and raises a change event whenever the value
   * changes.
   * @memberof np
   * @extends np.Disposable
   */
  class Observable extends Disposable {

    /**
     * Constructs a new observable value with the optionally provided initial
     * value. If an owner object is passed as the second argument it will be
     * used as the changed event's source.
     * @param {*} [value] - the initial value for this observable
     * @param {object} [object] - the owner object of the observable value
     */
    constructor(value, owner) {
      super();
      this._changed = new Event(owner || this);
      this._value = value;
    }

    /**
     * Adds an event listener to the 'changed' event and returns a remover
     * function.
     * @param {np.Observable~ChangedEventListener} listener - the listener
     *    function to be added
     * @param {object} [ctx] - an optional context object to bind the listener
     *    to
     * @return {np.Event~Remover}
     */
    onChanged(listener, ctx) { return this._changed.on(listener, ctx); }

    /**
     * Returns this observable's current value.
     * @return {*} this observable's current value
     */
    getValue() { return this._value; }

    /**
     * Sets this obserable's current value. The 'changed' event will be invoked
     * if the newValue is not identical (===) to the current value or the
     * optional force flag parameter was provided.
     * @param {*} newValue - the new value
     * @param {boolean} force - a flag indicating whether to invoke the 'changed'
     *    event even if the new value is identical to the current value
     * @return {np.Observable} this observable
     */
    setValue(newValue, force) {
      var oldValue = this._value;
      if ((oldValue !== newValue) || force) {
        this._value = newValue;
        if (this._changed.length) {
          this._changed.raise(newValue);
        }
      }
      return this;
    }

    /**
     * Raises this observable's changed event.
     * @param {*} value - the new value
     * @protected
     */
    _raiseChanged(value) {
      if (this._changed.length) {
        this._changed.raise({ value: value });
      }
    }

    /**
     * @inheritdoc
     */
    _dispose() {
      super._dispose();
      this._changed.dispose();
    }
  }

  return Observable;
});
