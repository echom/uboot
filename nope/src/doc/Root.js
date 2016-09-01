np.define('np.DocRoot', (require) => {
  var Event = require('np.Event'),
      DocElement = require('np.DocElement');

  class DocRoot extends DocElement {
    constructor() {
      super();
      this._maxId = this._id = 0;
      this._nodes = {};
    }

    getDocument() { return this; }

    setParent() {
      throw new Error('Document.setParent: Cannot set parent node of document.');
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

  return DocRoot;
});
