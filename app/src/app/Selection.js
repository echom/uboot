np.define('app.Selection', function() {
  var Event = np.require('np.Event');

  class Selection {
    constructor() {
      this._type = '';
      this._list = [];

      this._changed = new Event(this);
    }

    clear() {
      while (this._list.length) {
        this.remove(this._type, this._list[0]);
      }

      this._type = '';
      this._list = [];
    }

    add(type, item) {
      this._remove(type, item);
      if (type !== this._type) {
        this.clear();
      }
      this._type = type;
      this._list.push(item);
      this._raiseChanged(this._list.length - 1, item, null);
    }

    remove(type, item) {
      var index;
      if (type === this._type) {
        index = this._list.indexOf(item);
        if (index >= 0) {
          this._list.splice(index);
          this._raiseChanged(index, null, item);
        }
      }
    }

    _raiseChanged(index, added, removed) {
      if (this._changed.length) {
        this._changed.raise({
          type: this._type,
          index: index,
          added: added,
          removed: removed
        });
      }
    }
  }

  return Selection;
});
