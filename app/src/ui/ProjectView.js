np.define('ui.ProjectView', () => {
  var Element = np.require('ui.Element'),
      Container = np.require('ui.Container'),
      ScenesListView = np.require('ui.ScenesListView'),
      RenderView = np.require('ui.RenderView');

  class ProjectView extends Container {
    constructor(project, player) {
      super('div', 'app-project');

      this._scenesList = this.add(new ScenesListView(project.getScenes(), player));
      this._rightCol = this.add(new Container('div', 'app-right'));
      this._renderView = this._rightCol.add(new RenderView(project, player));
      this._editorView = this._rightCol.add(new Element('div', 'app-editor'));
    }
  }

  return ProjectView;
});
