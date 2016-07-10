np.define('ui.Toolbar', function() {
  var DomContainer = np.require('ui.DomContainer'),
      Button = np.require('ui.Button'),
      Toolbar,
      ToolbarButton;

  ToolbarButton = np.inherits(function(content, activate) {
    Button.call(this, 'li', 'toolbtn');
    this.onStateChanged().add(function(evt) {
      if (evt.newValue === Button.STATE_UP) {
        activate();
      }
    });
    this.setContent(content);
  }, Button);

  Toolbar = np.inherits(function(application) {
    DomContainer.call(this, 'ul', 'ui app-toolbar');

    this._application = application;

    this._hero = new Button('li', 'app-hero').setContent('uboot');
    this._hero.onStateChanged().add(function(evt) {
      if (evt.newValue === Button.STATE_UP) {
        this.toggleClass('open');
      }
    }.bind(this));
    this.append(this._hero);

    this._newProject = this.append(new ToolbarButton('new', function() {
      application.newProject();
    }));
    this._saveProject = this.append(new ToolbarButton('save', function() {
      application.persistProject();
    }));
    this._loadProject = this.append(new ToolbarButton('load', function() {
      application.restoreProject();
    }));
    this._close = this.append(new ToolbarButton('x', function() {
      this.toggleClass('open', false);
    }.bind(this)));
  }, DomContainer);

  return Toolbar;
});
