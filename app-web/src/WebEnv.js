np.define('app.WebEnv', () => {
  var Env = np.require('app.Env'),
      Dialog = np.require('ui.Dialog'),
      Element = np.require('ui.Element'),
      Container = np.require('ui.Container'),
      List = np.require('ui.List');

  class LocalStoragePersistence {
    static clear() {
      localStorage.clear();
    }

    getProjects() {
      if (!this._projects) {
        let projects = localStorage.getItem('uboot.projects');
        projects = projects ? JSON.parse(projects) : [];
        this._projects = projects;
      }
      return this._projects;
    }
    saveProjects() {
      localStorage.setItem('uboot.projects', JSON.stringify(this.getProjects()));
    }

    hasProject(name) {
      return this.getProjects().find(i => i === name);
    }
    saveProject(name, project) {
      if (!name) {
        throw new Error('LocalStoragePersistence.saveProject: No name provided.');
      }

      if (!this.hasProject(name)) {
        this.getProjects().push(name);
      }

      localStorage.setItem(name, JSON.stringify(project));

      this.saveProjects();
    }

    loadProject(name) {
      if (!name) {
        throw new Error('LocalStoragePersistence.loadProject: No name provided.');
      }
      if (!this.hasProject(name)) {
        throw new Error('LocalStoragePersistence.loadProject: Project "' + name + '".');
      }

      return JSON.parse(localStorage.getItem(name));
    }
  }


  class WebEnv extends Env {
    constructor(window, doc) {
      super();

      this._window = window;
      this._doc = doc;

      this._persistence = new LocalStoragePersistence();
    }

    queryOkCancel(message) {
      return Dialog.showMessage(this._doc, {
        message: message,
        buttons: [{ confirm: true, name: 'OK' }, { name: 'Cancel' }]
      });
    }
    queryYesNo(message) {
      return Dialog.showMessage(this._doc, {
        message: message,
        buttons: [{ confirm: true, name: 'Yes' }, { name: 'No' }]
      });
    }

    queryPersistInfo(persistInfo) {
      var projects = this._persistence.getProjects(),
          content = new Container('div', 'persist'),
          message = content.add(new Element('div', 'persist-message')),
          list = content.add(new List('ul', List.singleSelection, 'persist-projects dark')),
          nameLabel = content.add(new Element('span', 'persist-name-label')),
          name = content.add(new Element('input', 'persist-name-input'));
      projects.forEach((p) => list.add(new List.Item().setContent(p)));
      list.onSelectionChanged(evt => {
        if (evt.added.length) {
          name.getElement().value = evt.added[0].getContent();
        }
      });

      message.setContent(projects.length ?
        'You have ' + projects.length + ' projects. Choose one to overwrite or specify a new name below.' :
        'You don\'t have projects, yet. Please specifiy a name for your project below.'
      );

      nameLabel.setContent('Project name: ');

      return Dialog.showDialog(this._doc, {
        content: content.createElement(this._doc),
        buttons: [{ confirm: true, name: 'Save' }, { name: 'Cancel' }]
      }).then(() => {
        return { path: name.getElement().value };
      });
    }

    queryRestoreInfo() {
      var projects = this._persistence.getProjects(),
          content = new Container('div', 'persist'),
          message = content.add(new Element('div', 'persist-message')),
          list = content.add(new List('ul', List.singleSelection, 'persist-projects dark')),
          selected;
      projects.forEach((p) => list.add(new List.Item().setContent(p)));
      list.onSelectionChanged(evt => selected = evt.added[0]);

      if (projects.length) {
        message.setContent('Choose a project to load from the list below.');
        return Dialog.showDialog(this._doc, {
          content: content.createElement(this._doc),
          buttons: [{ confirm: true, name: 'Load' }, { name: 'Cancel' }]
        }).then(() => {
          return selected ? { path: selected.getContent() } : Promise.reject();
        });
      } else {
        return Dialog.showMessage(this._doc, {
          message: 'You don\'t have projects, yet.'
        }).then(() => Promise.reject());
      }
    }

    persist(persistInfo, toPersist) {
      this._persistence.saveProject(persistInfo.path, toPersist);
      return Promise.resolve();
    }
    restore(persistInfo) {
      return Promise.resolve(this._persistence.loadProject(persistInfo.path));
    }

    setTitle(title) {
      this._doc.querySelector('title').innerHTML = 'uboot - ' + title;
    }
  }

  return WebEnv;
});
