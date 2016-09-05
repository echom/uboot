np.define('np.DocNode', (require, name) => {
  var Disposable = require('np.Disposable');

  class DocNode extends Disposable {
    constructor() {
      super();

      this._id = -1;
      this._parent = null;
      this._root = null;
    }

    getId() { return this._id; }

    getRoot() { return this._root; }

    getParent() { return this._parent; }
    setParent(parent) {
      this._parent = parent;
      this._setRoot(this._parent ? this._parent.getRoot() : null);
    }

    _setRoot(root) {
      if (root !== this._root) {
        if (this._root) {
          this._orphan();
        }
        if (root) {
          this._adopt(root);
        }
      }
    }
    _orphan() {
      this._id = this._root.unregister(this);
      this._root = null;
    }
    _adopt(root) {
      this._root = root;
      this._id = this._root.register(this);
    }

    serialize(serializer) {
      serializer.write('id', this.getId());
    }
    deserialize(serializer) {
      this._id = serializer.read('id');
    }
  }

  return DocNode;
});
