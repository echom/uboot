np.define('doc.List', function() {
  var DocNode = np.require('doc.Node'),
      DocList,
      ListChangedEvent;

  ListChangedEvent = function(index, added, removed) {
    this.index = index;
    this.added = added;
    this.removed = removed;
  };

  DocList = np.inherits(function(parent) {
    DocNode.call(this, parent);
    this._items = [];
  }, DocNode);

  Object.defineProperty(DocList.prototype, 'length', {
    get: function() {
      return this._items.length;
    }
  });

  DocList.prototype._onChanged = function(index, added, removed) {
    if (this._changed.length) {
      this._changed.fire(new ListChangedEvent(index, added, removed));
    }
  };

  DocList.prototype.serialize = function() {
    return this._items.map(function(item) {
      return item.serialize();
    });
  };

  DocList.prototype.add = function(item) {
    var index = this._items.indexOf(item);
    this.removeAt(index);
    this._items.push(item);
    this._onChanged(index, item, null);

    return item;
  };

  DocList.prototype.remove = function(item) {
    this.removeAt(this._items.indexOf(item));
  };

  DocList.prototype.removeAt = function(index) {
    var item;
    if (index >= 0 && index < this._items.length) {
      item = this._items[index];
      this._items.splice(index, 1);
      this._onChanged(index, null, item);
    }
  };

  DocList.prototype._dispose = function() {
    DocNode.prototype._dispose.call(this);
    this._items.forEach(function(item) {
      item.dispose();
    });
  };

  return DocList;
});
