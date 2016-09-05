np.define('np.DocValue', function(require, name) {
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

    serialize(serializer) {
      super.serialize(serializer);
      serializer.write('value', this.getValue());
    }
    deserialize(serializer) {
      super.deserialize(serializer);
      this.setValue(serializer.read('value'));
    }
  }

  np.require('np.Serializer').register(name, DocValue);

  return DocValue;
});
