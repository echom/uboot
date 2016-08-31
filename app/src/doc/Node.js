np.define('doc.Node', () => {
  var Disposable = np.require('np.Disposable'),
      Event = np.require('np.Event'),
      id = 0;

  class DocNode extends Disposable {
    static getMaxId() { return id; }

    constructor(parent) {
      super();

      this._id = id++;
      this._parent = null;
      this._root = null;

      this._parent = parent || null;
      this._doc = parent ? parent.doc : null;
    }

    getDocument() { return this._parent ? this._parent.getDocument() : this; }

    getParent() { return this._parent; }

    getId() { return this._id; }

    setParent(parent) {
      this._parent = parent;
      return this;
    }

    serialize() {
      throw new Error('Node.serialize must be overridden');
    }

    _dispose() {
      this._changed.dispose();
    }
  }

  return DocNode;
});
