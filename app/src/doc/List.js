np.define('doc.List', () => {
  var List = np.require('np.List'),
      DocNode = np.require('doc.Node');

  class DocList extends DocNode {
    constructor(parent) {
      super(parent);
      this._items = new List();
    }

    get length() { return this._items.length; }

    _onChanged(index, added, removed) {
      if (this._changed.length) {
        this._changed.raise({
          index: index,
          added: added,
          removed: removed
        });
      }
    }

    serialize() {
      return this._items.toArray(item => item.serialize());
    }

    get(index) {
      return this._items.get(index);
    }

    indexOf(item) {
      return this._items.indexOf(item);
    }

    add(item) {
      return this.insertAt(item, this.length);
    }

    insertAt(item, index) {
      this._items.insertAt(item, index);
      if (this._items.get(index) === item) {
        item.setParent(this);
        this._onChanged(index, item, null);
      }
      return item;
    }

    remove(item) {
      return this.removeAt(this._items.indexOf(item));
    }

    removeAt(index) {
      var item;
      if (index >= 0 && index < this._items.length) {
        item = this._items.removeAt(index);
        item.setParent(null);
        this._onChanged(index, null, item);
      }
      return item;
    }

    forEach(fn, ctx) {
      this._items.forEach(fn, ctx);
    }

    toArray(mapFn, ctx) {
      this._items.toArray(mapFn, ctx);
    }

    _dispose() {
      DocNode.prototype._dispose.call(this);
      this._items.forEach(item => item.dispose());
    }
  }

  return DocList;
});
