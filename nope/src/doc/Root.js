np.define('np.DocRoot', (require, name) => {
  var DocElement = require('np.DocElement'),
      Serializer = require('np.Serializer');

  class DocRoot extends DocElement {
    constructor() {
      super();
      this._maxId = this._id = 0;
      this._nodes = {};
      this._deserializing = false;
    }

    getRoot() { return this; }

    setParent() {
      throw new Error(
        name + '.setParent: Cannot set parent node of root.'
      );
    }

    getNodeById(id) { return this._nodes[id]; }

    register(node) {
      var id = node.getId(),
          nd = this._nodes[id];
      if (id === -1) {
        id = ++this._maxId;
      }
      if (!nd || this._deserializing) {
        this._nodes[id] = node;
      } else if (nd !== node) {
        throw new Error(
          name + '.register: Node ID "' + id + '" is already assigned to another node.'
        );
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

    deserialize(serializer) {
      this._deserializing = true;
      super.deserialize(serializer);
      this._deserializing = false;
    }
  }

  Serializer.register(name, DocRoot);

  return DocRoot;
});
