np.define('model.Entity', function(require, name) {
  var DocElement = require('np.DocElement'),
      Input = require('model.Input');

  class Entity extends DocElement {
    constructor() {
      super();
      this.setMember('inputs', new DocElement());
    }

    getInputs() { return this.getMember('inputs'); }
    addInput(name, value, group) {
      this.getInputs().setMember(new Input(group || 'default', name, value));
    }

    getScene() { return this.getParent().getParent(); }

    createRenderState() {
      this.getScene().getRenderState().add(this._createRenderState());
    }

    applyState(state) {
      this._applyState(state, this._renderState);
    }
  }

  require('np.Serializer').register(name, Entity);

  return Entity;
});
