np.define('model.Entity', function() {
  var Element = np.require('doc.Element');

  class Entity extends Element {
    constructor(scene) {
      super(scene.getEntities());

      this._scene = scene;

      this.createRenderState();
    }

    getScene() { return this._scene; }

    createRenderState() {
      this
        .getScene()
        .getRenderState()
        .addRenderables(this._createRenderState());
    }

    applyState(state) {
      this._applyState(state, this._renderState);
    }
  }

  return Entity;
});
