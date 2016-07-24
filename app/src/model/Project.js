np.define('model.Project', () => {
  var Document = np.require('doc.Document'),
      List = np.require('doc.List'),
      Value = np.require('doc.Value'),
      Scene = np.require('model.Scene');

  class Project extends Document {
    constructor() {
      super();
      this._define('name', new Value(this, 'untitled'));
      this._define('scenes', new List(this));
    }

    getName() { return this._members.name.getValue(); }

    setName(value) { return this._members.name.setValue(value); }

    onNameChanged(handler, ctx) {
      return this._members.name.onChanged(handler, ctx);
    }

    getScenes() { return this._members.scenes; }

    onScenesChanged(handler, ctx) {
      return this._members.scenes.onChanged(handler, ctx);
    }

    static create() {
      var project = new Project();
      project.getScenes().add(Scene.create(project));
      return project;
    }
  }

  return Project;
});
