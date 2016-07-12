np.define('doc.Value', function() {
  var DocNode = np.require('doc.Node'),
      DocValue,
      ValueChangedEvent;

  ValueChangedEvent = function(newValue, oldValue) {
    this.newValue = newValue;
    this.oldValue = oldValue;
  };

  DocValue = np.inherits(function(parent, value) {
    DocNode.call(this, parent);
    this._value = value;
  }, DocNode);

  DocValue.prototype.getValue = function() {
    return this._value;
  };
  DocValue.prototype.setValue = function(newValue) {
    var oldValue = this._value;
    if (newValue !== oldValue) {
      this._value = newValue;
      this._onChanged(newValue, oldValue);
    }
    return this;
  };

  DocValue.prototype._onChanged = function(newValue, oldValue) {
    if (this._changed.length) {
      this._changed.raise(new ValueChangedEvent(newValue, oldValue));
    }
  };

  DocValue.prototype.serialize = function() {
    return this.value;
  };

  return DocValue;
});
