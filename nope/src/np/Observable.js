np.define('np.Observable', () => {
  var Disposable = np.require('np.Disposable'),
      Event = np.require('np.Event');

  class Observable extends Disposable {
    constructor(value, owner) {
      super();
      this._changed = new Event(owner || this);
      this._value = value;
    }
    onChanged(handler, ctx) { return this._changed.on(handler, ctx); }

    getValue() { return this._value; }

    setValue(newValue, force) {
      var oldValue = this._value;
      if ((oldValue !== newValue) || force) {
        this._value = newValue;
        if (this._changed.length) {
          this._changed.raise({ newValue: newValue, oldValue: oldValue });
        }
      }
      return this;
    }

    _dispose() {
      super._dispose();
      this._changed.dispose();
    }
  }

  return Observable;
});
