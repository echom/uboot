np.define('doc.Element', () => {
  var Event = np.require('np.Event'),
      DocNode = np.require('doc.Node');

  class ChangeEvent extends Event {
    raise(index, added, removed) {
      if (this.length) {
        super.raise({
          index: index,
          added: added,
          removed: removed
        });
      }
    }
  }

  class DocElement extends DocNode {
    constructor(parent) {
      super(parent);
      this._members = {};
      this._changed = new ChangeEvent(this);
    }

    setMember(name, newValue, force) {
      var oldValue = this.getMember(name);

      if ((oldValue !== newValue) || force) {
        this._members[name] = newValue;
        this._changed.raise(name, newValue, oldValue);
      }

      return this;
    }

    getMember(name) { return this._members[name]; }

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
