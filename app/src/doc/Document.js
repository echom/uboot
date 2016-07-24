np.define('doc.Document', () => {
  var DocElement = np.require('doc.Element');

  class DocDocument extends DocElement {
    constructor() {
      super();
    }

    setParent(parent) {
      throw new Error('Document.setParent: Cannot set parent node of document.');
    }

    serialize() {
      return JSON.stringify(super.serialize.call(this));
    }
  }

  return DocDocument;
});
