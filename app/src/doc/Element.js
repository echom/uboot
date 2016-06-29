np.define('doc.Element', function() {
  var DocNode = np.require('doc.Node'),
      DocElement;

  DocElement = np.inherits(function(parent) {
    DocNode.call(this, parent);
    this._members = {};
  }, DocNode);

  DocElement.prototype._define = function(name, value) {
    if (!this._members[name]) {
      this._members[name] = value;
      value.parent = this;
    } else {
      throw new Error('Element._define: "' + name + '" is already defined.');
    }
    return value;
  };

  DocElement.prototype.serialize = function() {
    var result = {},
        key;
    for (key in this._members) {
      result[key] = this._members[key].serialize();
    }
    return result;
  };

  DocElement.prototype._dispose = function() {
    var key;
    DocNode.prototype._dispose.call(this);
    for (key in this._members) {
      this._members[key].dispose();
    }
  };

  return DocElement;
});
