np.define('np.DocValue', function(require) {
  var Observable = require('np.Observable'),
      DocNode = require('np.DocNode');

  class DocValue extends DocNode {
    constructor(value) {
      super();
      this._value = new Observable(value, this);
    }

    getValue() { return this._value.getValue(); }
    setValue(value, force) { return this._value.setValue(value); }

    onChanged(handler, ctx) { return this._value.onChanged(handler, ctx); }

    _dispose() {
      super._dispose();
      this._value.dispose();
    }
  }

  return DocValue;
});
