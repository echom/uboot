np.define('model.Project', () => {
  var DocRoot = np.require('np.DocRoot'),
      DocList = np.require('np.DocList'),
      DocValue = np.require('np.DocValue'),
      Settings = np.require('model.Settings'),
      Scene = np.require('model.Scene');

  class Project extends DocRoot {
    constructor() {
      super();
      this.setMember('name', new DocValue('untitled'));
      this.setMember('scenes', new DocList());
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
    onScenesChanged(handler, ctx) { return this.getScenes().onChanged(handler, ctx); }
    getScene(index) { return this.getScenes().get(index); }
    addScene(scene) { return this.getScenes().add(scene); }
    removeScene(scene) { return this.getScenes().remove(scene); }
    insertSceneAt(scene, index) { return this.getScenes().insertAt(scene, index); }
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
