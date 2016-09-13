np.define('ui.ApplicationView', () => {
  var Container = np.require('ui.Container'),
      Toolbar = np.require('ui.Toolbar'),
      ProjectView = np.require('ui.ProjectView');

  class ApplicationView extends Container {
    constructor(application) {
      super('div', 'app');

      this._toolbar = this.add(new Toolbar(application));
      this._projectView = this.add(new ProjectView(
        application.getProject(),
        application.getPlayer(),
        application.getRenderer()
      ));

      application.onProjectChanged(evt => {
        this.remove(this._projectView);
        this._projectView = this.add(
          new ProjectView(
            application.getProject(),
            application.getPlayer(),
            application.getRenderer()
          ));
      });
    }
  }

  return ApplicationView;
});
