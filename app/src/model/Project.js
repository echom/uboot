np.define('model.Project', function() {
  var Document = np.require('doc.Document'),
      List = np.require('doc.List'),
      Value = np.require('doc.Value'),
      Scene = np.require('model.Scene'),
      Project;

  Project = np.inherits(function() {
    Document.call(this);
    this._define('name', new Value(this, 'untitled'));
    this._define('scenes', new List(this));
  }, Document);

  Project.prototype.getName = function() {
    return this._members.name.getValue();
  };
  Project.prototype.setName = function(value) {
    return this._members.name.setValue(value);
  };
  Project.prototype.onNameChanged = function() {
    return this._members.name.onChanged();
  };

  Project.prototype.getScenes = function() {
    return this._members.scenes;
  };
  Project.prototype.onScenesChanged = function() {
    return this._members.scenes.onChanged();
  };

  Project.new = function() {
    var project = new Project();
    project.getScenes().add(Scene.new());

    return project;
  };

  return Project;
});
