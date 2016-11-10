np.define('app2.Application', (require, className) => {
  var Observable = require('np.Observable'),
      Serializer = require('np.Serializer'),
      Settings = require('app2.Settings'),
      Project = require('app2.Project'),
      presolve = (arg) => Promise.resolve(arg);

  class Application {
    constructor(env, project) {
      this._env = env;

      this._settings = new Settings();
      this._project = new Observable(this);
    }

    getProject() { return this._project.getValue(); }
    setProject(project) { this._project.setValue(project); }

    createProject() {
      return Project.create();
    }
    openProject() {
      this._env.queryRestoreInfo()
        .then((persistInfo) => persistInfo ?
          this._restoreProject(persistInfo) :
          presolve()
        );
    }
    _openProject(persistInfo) {
      return this._env.restore(persistInfo)
        .then(serialized => {
          var serializer = new Serializer(),
              project = serializer.deserialize(serialized);
          this.setProject(project);
        });
    }
    saveProject() {
      return this.getProject() && this.getProject().getPersistInfo() ?
        this._saveProject(this.getProject().getPersistInfo()) :
        this.saveProjectAs();
    }
    saveProjectAs() {
      if (this.getProject()) {
        return this._env.queryPersistInfo(this.getProject().getPersistInfo())
          .then((persistInfo) => persistInfo ?
            this._saveProject(persistInfo) :
            presolve()
          );
      } else {
        return presolve();
      }
    }
    _saveProject(persistInfo) {
      var serializer = new Serializer(),
          serialized = serializer.serialize(this.getProject());
      return this._env.persist(persistInfo, serialized);
    }
  }

  return Application;
});
