np.define('np.DocNode', (require, name) => {
  var Disposable = require('np.Disposable');

  class DocNode extends Disposable {
    constructor() {
      super();

      this._id = -1;
      this._parent = null;
      this._document = null;
    }

    getId() { return this._id; }

    getDocument() { return this._document; }

    getParent() { return this._parent; }
    setParent(parent) {
      this._parent = parent;
      this._setDocument(this._parent ? this._parent.getDocument() : null);
    }

    _setDocument(doc) {
      if (doc !== this._document) {
        if (this._document) {
          this._orphan();
        }
        if (doc) {
          this._adopt(doc);
        }
      }
    }
    _orphan() {
      this._id = this._document.unregister(this);
      this._document = null;
    }
    _adopt(doc) {
      this._document = doc;
      this._id = this._document.register(this);
    }
  }

  return DocNode;
});
