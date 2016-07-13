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
  Project.prototype.onNameChanged = function(handler, ctx) {
    return this._members.name.onChanged(handler, ctx);
  };

  Project.prototype.getScenes = function() {
    return this._members.scenes;
  };
  Project.prototype.onScenesChanged = function(handler, ctx) {
    return this._members.scenes.onChanged(handler, ctx);
  };

  Project.new = function() {
    var project = new Project();
    project.getScenes().add(Scene.new(project));

    return project;
  };

  return Project;
});
