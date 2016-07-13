np.define('app.Selection', function() {
  var Selection;

  Selection = function() {
    this._groups = {};
  };

  Selection.prototype._getGroup = function(name) {
    return this._groups[name] || (this._groups[name] = []);
  };

  Selection.prototype.set = function(name, item) {
    var group = this._getGroup(name);
    group.length = 0;
    group.push(item);
  };
  Selection.prototype.add = function(name, item) {
    var group = this._getGroup(name),
        index = group.indexOf(item);

    if (index < 0) {
      group.push(item);
    }

    this._onSelectionChanged();
  };
  Selection.prototype.remove = function(name, item) {
    var group = this._getGroup(name),
        index = group.indexOf(item);

    if (index >= 0) {
      group.splice(index, 1);
    }

    this._onSelectionChanged();
  };

  Selection.prototype.isEmpty = function(name) {
    return this._getGroup(name).length === 0;
  };
  Selection.prototype.isSingle = function(name) {
    return this._getGroup(name).length === 1;
  };
  Selection.prototype.isMulti = function(name) {
    return this._getGroup(name).length > 1;
  };

  Selection.prototype.clear = function(name) {

  };

  return Selection;
});
