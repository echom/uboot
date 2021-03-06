np.define('ui.Toolbar', () => {
  var Container = np.require('ui.Container'),
      Button = np.require('ui.Button'),
      Icon = np.require('ui.Icon');

  class Toolbar extends Container {
    constructor(application) {
      super('ul', 'ui app-toolbar');

      this._hero = this.add(new Button(
        'li',
        'app-hero accent1',
        'uboot',
        () => this.toggleClass('open')
      ));

      this._newProject = this.add(new Button(
        'li',
        'btn',
        Icon.str('note_add') + '<small>New</small>',
        () => application.newProject()
      ));

      this._saveProject = this.add(new Button(
        'li',
        'btn',
        Icon.str('save') + '<small>Save</small>',
        () => application.persistProject())
      );

      this._loadProject = this.add(new Button(
        'li',
        'btn',
        Icon.str('folder_open') + '<small>Open</small>',
        () => application.restoreProject())
      );

      this._settings = this.add(new Button(
        'li',
        'btn',
        Icon.str('settings') + '<small>Settings</small>'
      ));

      // this._close = this.add(
      //   new Button('li', 'btn', Icon.str('close'), () => this.toggleClass('open', false))
      // );
    }
  }

  return Toolbar;
});
