np.define('app.Application', () => {
  var Observable = np.require('np.Observable'),
      Serializer = np.require('np.Serializer'),
      Project = np.require('model.Project'),
      Player = np.require('app.Player');

  class Application {
    constructor(env, project) {
      this._env = env;
      this._project = new Observable(null, this);
      this._player = null;

      this._renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      this._renderer.setClearColor(0xffffff, 0);

      this._persistInfo = null;

      this._recorder = {
        hasChanges: true,
        reset: () => {}
      };

      this.newProject = this.newProject.bind(this);
      this.persistProject = this.persistProject.bind(this);
      this.restoreProject = this.restoreProject.bind(this);
      this._setProject = this._setProject.bind(this);
      this._restoreProject = this._restoreProject.bind(this);
      this._persistProject = this._persistProject.bind(this);

      this.onProjectChanged(this._onProjectChanged, this);
      this._setProject(project || Project.create());
    }

    getProject() { return this._project.getValue(); }

    onProjectChanged(handler, ctx) {
      return this._project.onChanged(handler, ctx);
    }

    getPlayer() { return this._player; }

    getRenderer() { return this._renderer; }

    _setTitle(title) {
      this._env.setTitle(title);
      return this;
    }

    _setProject(project) {
      this._project.setValue(project);
      this._recorder.reset();
      this._player = new Player(project);
      return this;
    }

    _onProjectChanged(evt) {
      var project = evt.value;

      if (this._offNameChanged) {
        this._offNameChanged();
      }

      if (project) {
        project.onNameChanged(this._onProjectNameChanged, this);
        this._setTitle(project.getName());
      } else {
        this._setProject(Project.create());
      }
    }

    _onProjectNameChanged(evt) {
      this._setTitle(evt.value);
    }

    newProject() {
      var project = this.getProject();
      if (project && this._recorder.hasChanges) {
        this._env.queryYesNo(project.getName() + ' has unsaved changes. Do you want to save it?')
          .then(this.persistProject, np.noop)
          .then(() => {
            this._setProject(Project.create());
            this._persistInfo = null;
          });
      } else {
        this._setProject(Project.create());
      }
    }

    persistProject() {
      return this._persistInfo ?
        this._persistProject(this._persistInfo) :
        this.persistProjectAs();
    }

    persistProjectAs() {
      return this._env.queryPersistInfo(this._persistInfo)
        .then(this._persistProject, np.noop);
    }

    _persistProject(persistInfo) {
      var serializer = new Serializer();

      return this._env.persist(persistInfo, serializer.serialize(this.getProject()))
        .then(() => {
          this._persistInfo = persistInfo;
          this.getProject().setName(this._persistInfo.path.split('/').pop());
          this._recorder.reset();
        });
    }

    restoreProject() {
      return this._env.queryRestoreInfo(this._persistInfo)
        .then(this._restoreProject, np.noop);
    }

    _restoreProject(persistInfo) {
      var serializer = new Serializer();
      return this._env.restore(persistInfo)
        .then(restored => {
          this._setProject(serializer.deserialize(restored));
          this._persistInfo = persistInfo;
          this.getProject().setName(this._persistInfo.path.split('/').pop());
        });
    }
  }

  return Application;
});
