np.define('np.DocRoot', (require, name) => {
  var DocElement = require('np.DocElement');

  class DocRoot extends DocElement {
    constructor() {
      super();
      this._maxId = this._id = 0;
      this._nodes = {};
    }

    getRoot() { return this; }

    setParent() {
      throw new Error('DocRoot.setParent: Cannot set parent node of root.');
    }

    getNodeById(id) { return this._nodes[id]; }

    register(node) {
      var id = node.getId();
      if (id === -1) {
        id = ++this._maxId;
        this._nodes[id] = node;
      }
      return id;
    }
    unregister(node) {
      var id = node.getId();
      if (id !== -1) {
        delete this._nodes[node.getId()];
      }
      return -1;
    }
  }
  np.require('np.Serializer').register(name, DocRoot);

  return DocRoot;
});
