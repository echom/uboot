np.define('model.Project', () => {
  var Document = np.require('doc.Document'),
      List = np.require('doc.List'),
      Value = np.require('doc.Value'),
      Settings = np.require('model.Settings'),
      Scene = np.require('model.Scene');

  class Project extends Document {
    constructor() {
      super();
      this.setMember('name', new Value(this, 'untitled'));
      this.setMember('scenes', new List(this));

      this.setMember('settings', new Settings(this));
    }

    getName() { return this.getMember('name').getValue(); }

    setName(value) {
      this.getMember('name').setValue(value);
      return this;
    }

    onNameChanged(handler, ctx) {
      return this.getMember('name').onChanged(handler, ctx);
    }

    getScenes() { return this.getMember('scenes'); }
    getScene(index) { return this.getScenes().get(index); }
    onScenesChanged(handler, ctx) { return this.getScenes().onChanged(handler, ctx); }
    addScene(scene) { return this.getScenes().add(scene); }
    insertSceneAt(scene, index) { return this.getScenes().insertAt(scene, index); }
    removeScene(scene) { return this.getScenes().remove(scene); }
    removeSceneAt(index) { return this.getScenes().removeAt(index); }

    getSettings() { return this.getMember('settings'); }

    static create() {
      var project = new Project();
      project.getScenes().add(Scene.create(project));
      return project;
    }
  }

  return Project;
});
