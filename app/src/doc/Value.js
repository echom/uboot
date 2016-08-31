np.define('doc.Value', () => {
  var Observable = np.require('np.Observable'),
      DocNode = np.require('doc.Node');

  class DocValue extends DocNode {
    constructor(parent, value) {
      super(parent);
      this._value = new Observable(value, this);
    }

    getValue() { return this._value.getValue(); }

    setValue(value) {
      this._value.setValue(value);
      return this;
    }

    onChanged(handler, ctx) { this._value.onChanged(handler, ctx); }

    serialize() { return this.getValue(); }

    _dispose() {
      super._dispose();
      this._value.dispose();
    }
  }

  return DocValue;
});
