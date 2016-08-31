np.define('doc.List', () => {
  var Event = np.require('np.Event'),
      List = np.require('np.List'),
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

  class DocList extends DocNode {
    constructor(parent) {
      super(parent);
      this._items = new List();
      this._changed = new ChangeEvent(this);
    }

    get length() { return this._items.length; }

    onChanged(handler, ctx) { return this._changed.on(handler, ctx); }

    serialize() {
      return this._items.toArray(item => item.serialize());
    }

    get(index) { return this._items.get(index); }

    first() { return this._items[0]; }

    last() { return this._items[this._items.length - 1]; }

    indexOf(item) { return this._items.indexOf(item); }

    add(item) {
      return this.insertAt(item, this.length);
    }

    insertAt(item, index) {
      this._items.insertAt(item, index);
      if (this._items.get(index) === item) {
        item.setParent(this);
        this._changed.raise(index, item, null);
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
        this._changed.raise(index, null, item);
      }
      return item;
    }

    forEach(fn, ctx) {
      this._items.forEach(fn, ctx);
    }

    toArray(mapFn, ctx) {
      return this._items.toArray(mapFn, ctx);
    }

    _dispose() {
      DocNode.prototype._dispose.call(this);
      this._items.forEach(item => item.dispose());
    }
  }

  return DocList;
});
