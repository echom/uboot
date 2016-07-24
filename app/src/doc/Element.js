np.define('doc.Element', () => {
  var DocNode = np.require('doc.Node');

  class DocElement extends DocNode {
    constructor(parent) {
      super(parent);
      this._members = {};
    }
    _define(name, value) {
      if (!this._members[name]) {
        this._members[name] = value;
        value.parent = this;
      } else {
        throw new Error('Element._define: "' + name + '" is already defined.');
      }
      return value;
    }

    serialize() {
      var result = {},
          key;
      for (key in this._members) {
        result[key] = this._members[key].serialize();
      }
      return result;
    }

    _dispose() {
      var key;
      DocNode.prototype._dispose.call(this);
      for (key in this._members) {
        this._members[key].dispose();
      }
    }
  }

  return DocElement;
});
