np.define('app.WebEnv', () => {
  var Env = np.require('app.Env'),
      Dialog = np.require('ui.Dialog'),
      Element = np.require('ui.Element'),
      Container = np.require('ui.Container'),
      List = np.require('ui.List');

  class WebEnv extends Env {
    constructor(window, doc) {
      super();

      this._window = window;
      this._doc = doc;
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
      var projects = JSON.parse(localStorage.getItem('projects')) || [],
          content = new Container('persist'),
          list = content.add(new List('ul', null, 'persist-projects')),
          name = content.add(new Element('input', null, 'persist-name'));
      projects.forEach((p) => list.add(new List.Item().setContent(p)));
      list.onSelectionChanged(evt => name.value = evt.added.getContent());

      return Dialog.showDialog(this._doc, {
        content: content.createElement(this._doc),
        buttons: [{ confirm: true, name: 'Save' }, { name: 'Cancel' }]
      }).then(() => ({ path: name.value }));
    }

    persist(persistInfo, toPersist) {
      var projects = JSON.parse(localStorage.getItem('projects')) || [];
      if (!projects.find(i => i == persistInfo.path)) {
        projects.push(persistInfo.path);
        localStorage.setItem('projects', JSON.stringify(projects));
      }

      localStorage.setItem(persistInfo.path, JSON.stringify(toPersist));

      return Promise.resolve();
    }

    setTitle(title) {
      this._doc.querySelector('title').innerHTML = 'uboot - ' + title;
    }
  }

  return WebEnv;
});
