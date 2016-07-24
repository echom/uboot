np.define('ui.Toolbar', () => {
  var View = np.require('ui.View'),
      Button = np.require('ui.Button');

  class Toolbar extends View {
    constructor(application) {
      super(application, 'ul', 'ui app-toolbar');

      this._hero = this.add(
        new Button('li', 'app-hero', 'uboot', () => this.toggleClass('open'))
      );

      this._newProject = this.add(
        new Button('li', 'toolbtn', 'new', () => application.newProject())
      );

      this._saveProject = this.add(
        new Button('li', 'toolbtn', 'save', () => application.persistProject())
      );

      this._loadProject = this.add(
        new Button('li', 'toolbtn', 'load', () => application.restoreProject())
      );

      this._close = this.add(
        new Button('li', 'toolbtn', 'x', () => this.toggleClass('open', false))
      );
    }
  }

  return Toolbar;
});
