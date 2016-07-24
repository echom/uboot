np.define('doc.Reference', () => {
  var DocValue = np.require('doc.Value');

  class DocReference extends DocValue {
    constructor(parent, value) {
      super(parent, value);
    }

    serialize() {
      return this.getValue() ? this.getValue().getId() : -1;
    }
  }

  return DocReference;
});
