np.define('entities.BoxEntity', function(require, name) {
  var Entity = require('model.Entity'),
      Vector3Value = require('model.Vector3Value');

  class BoxEntity extends Entity {
    constructor() {
      super();

      this.addInput('position', new Vector3Value(new THREE.Vector3()));
      this.addInput('rotation', new Vector3Value(new THREE.Vector3()));
    }

    _createRenderState() {
      var geo = new THREE.BoxGeometry(1, 1, 1),
          mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
          box = new THREE.Mesh(geo, mat);
      box.position.z = -5;
      box.rotation.x = 0.4;
      box.rotation.y = 0.8;

      box.data = { pickingId: this.getId() };

      return [box];
    }
  }

  require('np.Serializer').register(name, BoxEntity);

  return BoxEntity;
});
