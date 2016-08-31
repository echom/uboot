np.define('entities.BoxEntity', function() {
  var Entity = np.require('model.Entity');

  class BoxEntity extends Entity {
    constructor(scene) {
      super(scene);

      this.addInput('position', new THREE.Vector3(0, 0, 0));
      this.addInput('rotation', new THREE.Vector3(0, 0, 0));
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

  return BoxEntity;
});
