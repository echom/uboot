np.define('np.Observable', function() {
  var Disposable = np.require('np.Disposable'),
      Event = np.require('np.Event'),
      Observable;

  Observable = np.inherits(function(value) {
    this._changed = new Event(this);
    this._value = value;
  }, Disposable);

  Observable.prototype.onChanged = function() {
    return this._changed.getInterface();
  };

  Observable.prototype.getValue = function() {
    return this._value;
  };
  Observable.prototype.setValue = function(newValue, force) {
    var oldValue = this._value;
    if ((oldValue !== newValue) || force) {
      this._value = newValue;
      if (this._changed.length) {
        this._changed.fire({ newValue: newValue, oldValue: oldValue });
      }
    }
    return this;
  };

  Observable.prototype._dispose = function() {
    Disposable.prototype._dispose.call(this);
    this._changed.dispose();
  };

  return Observable;
});
