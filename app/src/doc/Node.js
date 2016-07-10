np.define('doc.Node', function() {
  var Disposable = np.require('np.Disposable'),
      Event = np.require('np.Event'),
      abstractInvocationError = np.require('np.error').abstractInvocation,
      DocNode,
      id = 0;

  DocNode = np.inherits(function(parent) {
    this._id = id++;
    this._changed = new Event(this);
    this._parent = null;
    this._root = null;

    this._parent = parent || null;
    this._doc = parent ? parent.doc : null;
  }, Disposable);

  DocNode.getMaxId = function() {
    return id;
  };

  DocNode.prototype.onChanged = function() {
    return this._changed.getInterface();
  };

  DocNode.prototype.getDocument = function() {
    return this._parent ? this._parent.getDocument() : this;
  };

  DocNode.prototype.getParent = function() {
    return this._parent;
  };
  DocNode.prototype.setParent = function(parent) {
    this._parent = parent;
    return this;
  };

  DocNode.prototype.serialize = function() {
    throw abstractInvocationError();
  };

  DocNode.prototype._dispose = function() {
    this._changed.dispose();
  };

  return DocNode;
});
