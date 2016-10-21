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
      serializer.write('value', this._getSerializationValue());
    }
    deserialize(serializer) {
      super.deserialize(serializer);
      this._setSerializationValue(serializer.read('value'));
    }
    _getSerializationValue() { return this.getValue(); }
    _setSerializationValue(value) { return this.setValue(value); }
  }

  np.require('np.Serializer').register(name, DocValue);

  return DocValue;
});
