np.define('ui.Toolbar', function() {
  var DomContainer = np.require('ui.DomContainer'),
      Button = np.require('ui.Button'),
      Toolbar,
      ToolbarButton;

  ToolbarButton = np.inherits(function(content, activate) {
    Button.call(this, 'li');
    this.onStateChanged().add(function(evt) {
      if (evt.newValue === Button.BUTTON_STATE_UP) {
        activate();
      }
    });
    this.setContent(content);
  }, Button);

  Toolbar = np.inherits(function(application) {
    DomContainer.call(this, 'ul', 'app-toolbar');

    this._application = application;

    this._newProject = this.append(new ToolbarButton('new', function() {
      application.newProject();
    }));
    this._saveProject = this.append(new ToolbarButton('save', function() {
      application.persistProject();
    }));
    this._loadProject = this.append(new ToolbarButton('load', function() {
      application.restoreProject();
    }));
  }, DomContainer);

  return Toolbar;
});
