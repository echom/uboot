np.define('np.DocList', (require, name) => {
  var Event = require('np.Event'),
      List = require('np.List'),
      DocNode = require('np.DocNode');

  class ChangedEvent extends Event {
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
    constructor() {
      super();
      this._items = new List();
      this._changed = new ChangedEvent();
    }

    get length() { return this._items.length; }

    onChanged(handler, ctx) { return this._changed.on(handler, ctx); }

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

    _orphan() {
      super._orphan();
      this.forEach(i => i._orphan(null));
    }
    _adopt(doc) {
      super._adopt(doc);
      this.forEach(i => i._adopt(doc));
    }

    _dispose() {
      super._dispose();
      this._items.forEach(i => i.dispose());
    }

    serialize(serializer) {
      super.serialize(serializer);
      serializer.write(
        'items',
        this.getItems().toArray((item) => serializer.serialize(item))
      );
    }
    deserialize(serializer) {
      super.deserialize(serializer);
      serializer.read('items').forEach(item => this.getItems().add(item));
    }
  }

  np.require('np.Serializer').register(name, DocList);

  return DocList;
});
