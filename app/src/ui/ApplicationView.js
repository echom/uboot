np.define('ui.ApplicationView', () => {
  var View = np.require('ui.View'),
      Toolbar = np.require('ui.Toolbar'),
      ProjectView = np.require('ui.ProjectView');

  class ApplicationView extends View {
    constructor(application) {
      super(application, 'div', 'app');

      this._toolbar = this.add(new Toolbar(application));
      this._projectView = this.add(new ProjectView(application, application.getProject()));

      application.onProjectChanged(evt => {
        this.remove(this._projectView);
        this._projectView = this.add(new ProjectView(application, evt.newValue));
      });
    }
  }

  return ApplicationView;
});
