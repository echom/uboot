np.define('np.List', () => {
  class List {
    constructor() {
      this._items = [];
    }

    get length() { return this._items.length; }

    get(index) { return this._items[index]; }

    indexOf(item) { return this._items.indexOf(item); }

    contains(item) { return this.indexOf(item) >= 0; }

    forEach(fn, ctx) { this._items.forEach(fn, ctx); }

    find(fn, ctx) { return this._items.find(fn, ctx); }

    add(item) { return this.insertAt(item, this._items.length); }

    remove(item) { return this.removeAt(this._items.indexOf(item)); }

    insertAt(item, index) {
      if (!item) {
        throw new Error('np.List#insertAt: item is undefined');
      }

      this.remove(item);
      if (index >= 0 && index <= this._items.length) {
        this._items.splice(index, 0, item);
      }
      return item;
    }

    removeAt(index) {
      var item;
      if (index >= 0 && index < this._items.length) {
        item = this._items[index];
        this._items.splice(index, 1);
      }
      return item;
    }

    replaceAt(item, index) {
      var removed;
      if (index >= 0 && index <= this._items.length) {
        removed = this.removeAt(index);
        this.insertAt(item, index);
      }
      return removed;
    }

    clear() {
      while (this._items.length) {
        this.removeAt(0);
      }
    }

    toArray(mapFn, ctx) {
      return this._items.map(mapFn || (i => i), ctx);
    }
  }

  return List;
});
