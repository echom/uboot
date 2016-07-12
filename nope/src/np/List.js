np.define('np.List', function() {
  var List;

  List = function() {
    this._items = [];
  };

  Object.defineProperty(List.prototype, 'length', {
    get: function() {
      return this._items.length;
    }
  });

  List.prototype.get = function(index) {
    return this._items[index];
  };

  List.prototype.indexOf = function(item) {
    return this._items.indexOf(item);
  };
  List.prototype.forEach = function(fn, ctx) {
    this._items.forEach(fn, ctx);
  };

  List.prototype.add = function(item) {
    return this.insertAt(item, this._items.length);
  };
  List.prototype.remove = function(item) {
    return this.removeAt(this._items.indexOf(item));
  };
  List.prototype.replaceAt = function(item, index) {
    var removed;
    if (index >= 0 && index <= this._items.length) {
      removed = this.removeAt(index);
      this.insertAt(item, index);
    }
    return removed;
  };
  List.prototype.insertAt = function(item, index) {
    if (!item) {
      throw new Error('np.List#insertAt: item is undefined');
    }

    this.remove(item);
    if (index >= 0 && index <= this._items.length) {
      this._items.splice(index, 0, item);
    }
    return item;
  };
  List.prototype.removeAt = function(index) {
    var item;
    if (index >= 0 && index < this._items.length) {
      item = this._items[index];
      this._items.splice(index, 1);
    }
    return item;
  };

  return List;
});
