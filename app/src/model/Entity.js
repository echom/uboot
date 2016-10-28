np.define('model.Entity', function(require, name) {
  var DocElement = require('np.DocElement'),
      Input = require('model.Input');

  class Entity extends DocElement {
    constructor() {
      super();
      this.setMember('inputs', new DocElement());
    }

    getInputs() { return this.getMember('inputs'); }
    getInputList() {
      return this.getInputs().getMemberList();
    }
    addInput(name, type, value, group) {
      this.getInputs().setMember(name, new Input(type, group || 'default', name, value));
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
