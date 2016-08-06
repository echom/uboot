np.define('ui.ProjectView', () => {
  var Container = np.require('ui.Container'),
      ScenesListView = np.require('ui.ScenesListView'),
      PlayerControls = np.require('ui.PlayerControls'),
      RenderView = np.require('ui.RenderView');

  class ProjectView extends Container {
    constructor(project, player) {
      super('div', 'app-project');

      this._scenesList = this.add(new ScenesListView(project.getScenes(), player));
      this._rightCol = this.add(new Container('div', 'app-right'));
      this._renderView = this._rightCol.add(new RenderView(project, player));
      this._playerView = this._rightCol.add(new PlayerControls(player));
    }
  }

  return ProjectView;
});
