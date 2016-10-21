np.define('model.Vector3Value', (require, name) => {
  var DocValue = require('np.DocValue'),
      Serializer = require('np.Serializer');

  class Vector3Value extends DocValue {
    _getSerializationValue() {
      var value = this.getValue();
      return [value.x, value.y, value.z];
    }
    _setSerializationValue(value) {
      this.setValue(new THREE.Vector3(value[0], value[1], value[2]));
    }
  }

  Serializer.register(name, Vector3Value);

  return Vector3Value;
});
