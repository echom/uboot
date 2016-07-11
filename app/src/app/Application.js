np.define('app.Application', function() {
  var Observable = np.require('np.Observable'),
      Project = np.require('model.Project'),
      Player = np.require('app.Player'),
      Application;

  Application = function(env, project) {
    this._env = env;
    this._project = new Observable(null, this);
    this._player = new Player(this._project);

    this._persistInfo = null;

    this._recorder = {
      hasChanges: true,
      reset: function() {}
    };

    this.newProject = this.newProject.bind(this);
    this.persistProject = this.persistProject.bind(this);
    this.restoreProject = this.restoreProject.bind(this);
    this._setProject = this._setProject.bind(this);
    this._restoreProject = this._restoreProject.bind(this);
    this._persistProject = this._persistProject.bind(this);

    this._onProjectNameChanged = this._onProjectNameChanged.bind(this);
    this._onProjectChanged = this._onProjectChanged.bind(this);

    this.onProjectChanged().add(this._onProjectChanged);
    this._setProject(project || Project.new());
  };

  Application.prototype.getProject = function() {
    return this._project.getValue();
  };
  Application.prototype.onProjectChanged = function() {
    return this._project.onChanged();
  };

  Application.prototype.getPlayer = function() {
    return this._player;
  };


  Application.prototype._setTitle = function(title) {
    this._env.setTitle(title);
  };

  Application.prototype._setProject = function(project) {
    this._project.setValue(project);
    this._recorder.reset();
  };
  Application.prototype._onProjectChanged = function(evt) {
    if (evt.oldValue) {
      evt.oldValue.onNameChanged().remove(this._onProjectNameChanged);
    }
    if (evt.newValue) {
      evt.newValue.onNameChanged().add(this._onProjectNameChanged);
      this._setTitle(evt.newValue.getName());
    } else {
      this._setProject(Project.new());
    }
  };
  Application.prototype._onProjectNameChanged = function(evt) {
    this._setTitle(evt.newValue);
  };

  Application.prototype.newProject = function() {
    var that = this,
        project = this.getProject();
    if (project && this._recorder.hasChanges) {
      this._env.queryYesNo(project.getName() + ' has unsaved changes. Do you want to save it?')
        .then(this.persistProject, np.noop)
        .then(function() {
          that._setProject(Project.new());
        });
    } else {
      this._setProject(Project.new());
    }
  };

  Application.prototype.persistProject = function() {
    return this._persistInfo ?
      this._persistProject(this._persistInfo) :
      this.persistProjectAs();
  };

  Application.prototype.persistProjectAs = function() {
    return this._env.queryPersistInfo(this._persistInfo)
      .then(this._persistProject);
  };

  Application.prototype._persistProject = function(persistInfo) {
    var that = this;
    return this._env.persist(persistInfo, this._project.serialize())
      .then(function() {
        that._persistInfo = persistInfo;
        that._recorder.reset();
      });
  };

  Application.prototype.restoreProject = function() {
    return this._env.queryRestoreInfo(this._persistInfo)
      .then(this._restoreProject, np.noop);
  };

  Application.prototype._restoreProject = function(persistInfo) {
    var that = this;
    return this._env.restore(persistInfo)
      .then(function(restored) {
        that._setProject(Project.deserialize(restored));
        that._persistInfo = persistInfo;
      });
  };

  return Application;
});
