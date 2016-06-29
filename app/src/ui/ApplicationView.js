np.define('ui.ApplicationView', function() {
  var DomContainer = np.require('ui.DomContainer'),
      Toolbar = np.require('ui.Toolbar'),
      ProjectView = np.require('ui.ProjectView'),
      ApplicationView;

  ApplicationView = np.inherits(function(application) {
    DomContainer.call(this, 'div');
    this._application = application;
    this._toolbar = this.append(new Toolbar(application));
    this._projectView = this.append(new ProjectView(application.project));
    
    this.addClass('app');
  }, DomContainer);

  return ApplicationView;
});
