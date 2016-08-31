np.define('model.Entity', function() {
  var Element = np.require('doc.Element'),
      Input = np.require('model.Input');

  class Entity extends Element {
    constructor(scene) {
      super(scene.getEntities());

      this._scene = scene;
      this.setMember('inputs', new Element(this));

      this.createRenderState();
    }

    getInputs() { return this.getMember('inputs'); }
    addInput(name, value, group) {
      this.getInputs().setMember(new Input(group || 'default', name, value));
    }

    getScene() { return this._scene; }

    createRenderState() {
      this
        .getScene()
        .getRenderState()
        .add(this._createRenderState());
    }

    applyState(state) {
      this._applyState(state, this._renderState);
    }
  }

  return Entity;
});
