np.define('app.Selection', function() {
  var List = np.require('np.List'),
      Event = np.require('np.Event'),
      Selection,
      SelectionGroup;

  SelectionGroup = np.inherits(function(name) {
    List.call(this);
    this._name = name;
    this._mute = false;
    this._changed = new Event();
  }, List);

  SelectionGroup.prototype.onChanged = function(handler, ctx) {
    return this._changed.on(handler, ctx);
  };

  SelectionGroup.prototype.isEmpty = function() {
    return this.length === 0;
  };
  SelectionGroup.prototype.isSingle = function() {
    return this.length === 1;
  };
  SelectionGroup.prototype.isMulti = function() {
    return this.length > 1;
  };

  SelectionGroup.prototype.set = function(item) {
    this.clear();
    this.add(item);
  };
  SelectionGroup.prototype.toggle = function(item) {
    if (this.contains(item)) {
      this.remove(item);
    } else {
      this.add(item);
    }
  };
  SelectionGroup.prototype.clear = function() {
    var length = this.length;
    this._mute = true;
    List.prototype.clear.call(this);
    this._mute = false;
    if (length !== this.length) {
      this._onChanged();
    }
  };
  SelectionGroup.prototype.insertAt = function(item, index) {
    var length = this.length;
    List.prototype.insertAt.call(this, item, index);
    if (length !== this.length && !this._mute) {
      this._onChanged();
    }
  };
  SelectionGroup.prototype.removeAt = function(index) {
    var length = this.length;
    List.prototype.removeAt.call(this, index);
    if (this.length !== length && !this._mute) {
      this._onChanged();
    }
  };

  SelectionGroup.prototype._onChanged = function() {
    this._changed.raise();
  };

  Selection = function() {
    this._groups = {};
    this._current = null;
    this._changed = new Event(this);
  };

  Selection.prototype.getCurrent = function() {
    return this._current;
  };

  Selection.prototype.getGroup = function(name) {
    var group = this._groups[name];
    if (!group) {
      this._groups[name] = group = new SelectionGroup();
      group.onChanged(function() {
        if (this._current !== group) {
          this._current = group;
        }
      }.bind(this));
    }

    return this._groups[name] || (this._groups[name] = new SelectionGroup());
  };

  return Selection;
});
