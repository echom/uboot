np.define('ui.Toolbar', () => {
  var Container = np.require('ui.Container'),
      Button = np.require('ui.Button'),
      Icon = np.require('ui.Icon');

  class Toolbar extends Container {
    constructor(application) {
      super('ul', 'ui app-toolbar');

      this._hero = this.add(
        new Button('li', 'app-hero', 'uboot', () => this.toggleClass('open'))
      );

      this._newProject = this.add(
        new Button('li', 'toolbtn', Icon.str('note_add'), () => application.newProject())
      );

      this._saveProject = this.add(
        new Button('li', 'toolbtn', Icon.str('save'), () => application.persistProject())
      );

      this._loadProject = this.add(
        new Button('li', 'toolbtn', Icon.str('folder_open'), () => application.restoreProject())
      );

      this._settings = this.add(
        new Button('li', 'toolbtn', Icon.str('settings'), () => { throw new Error('not implemented'); })
      );

      this._close = this.add(
        new Button('li', 'toolbtn', Icon.str('close'), () => this.toggleClass('open', false))
      );
    }
  }

  return Toolbar;
});
