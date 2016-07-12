np.define('ui.ApplicationView', function() {
  var View = np.require('ui.View'),
      Toolbar = np.require('ui.Toolbar'),
      ProjectView = np.require('ui.ProjectView'),
      ApplicationView;

  ApplicationView = np.inherits(function(application) {
    View.call(this, application, 'div', 'app');
    this._toolbar = this.add(new Toolbar(application));

    this._projectView = this.add(new ProjectView(application, application.getProject()));
    application.onProjectChanged().add(function(evt) {
      this.remove(this._projectView);
      this._projectView = this.append(new ProjectView(application, evt.newValue));
    }.bind(this));
  }, View);

  return ApplicationView;
});
