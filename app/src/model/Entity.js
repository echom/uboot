np.define('model.Entity', function() {
  var Element = np.require('doc.Element'),
      Value = np.require('doc.Value');

  class Entity extends Element {
    constructor(scene) {
      super(scene.getEntities());

      this._scene = scene;

      this.createRenderState();
    }

    getScene() { return this._scene; }

    createRenderState() {
      var sceneRenderState = this.getScene().getRenderState(),
          renderState = this._createRenderState();

      Object.keys(renderState).forEach(key => {
        sceneRenderState.scene.add(renderState[key]);
      });
    }

    applyState(state) {
      this._applyState(state, this._renderState);
    }
  }

  return Entity;
});
