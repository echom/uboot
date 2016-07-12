np.define('ui.Toolbar', function() {
  var Container = np.require('ui.Container'),
      Button = np.require('ui.Button'),
      Toolbar,
      ToolbarButton;

  ToolbarButton = np.inherits(function(content, onActivate) {
    Button.call(this, 'li', 'toolbtn', content, onActivate);
  }, Button);

  Toolbar = np.inherits(function(application) {
    Container.call(this, 'ul', 'ui app-toolbar');

    this._application = application;

    this._hero = this.add(new Button(
      'li',
      'app-hero',
      'uboot',
      function(evt) { this.toggleClass('open'); }.bind(this)
    ));

    this._newProject = this.add(
      new ToolbarButton('new', function() { application.newProject(); })
    );

    this._saveProject = this.add(
      new ToolbarButton('save', function() { application.persistProject(); })
    );

    this._loadProject = this.add(
      new ToolbarButton('load', function() { application.restoreProject(); })
    );

    this._close = this.add(
      new ToolbarButton('x', function() { this.toggleClass('open', false); }.bind(this))
    );
  }, Container);

  return Toolbar;
});
