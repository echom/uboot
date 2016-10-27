np.define('ui.ProjectView', () => {
  var Container = np.require('ui.Container'),
      ScenesListView = np.require('ui.ScenesListView'),
      PlayerControls = np.require('ui.PlayerControls'),
      RenderView = np.require('ui.RenderView'),
      InputsView = np.require('ui.InputsView');

  class ProjectView extends Container {
    constructor(application) {
      var left,
          center,
          right;

      super('div', 'app-project');

      left = this.add(new Container('div', 'app-left'));
      center = this.add(new Container('div', 'app-center'));
      right = this.add(new Container('div', 'app-right'));

      this._scenesList = left.add(new ScenesListView(application));
      this._renderView = center.add(new RenderView(application));
      this._playerView = center.add(new PlayerControls(application));
      this._inputsView = right.add(new InputsView(application));
    }
  }

  return ProjectView;
});
