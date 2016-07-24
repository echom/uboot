np.define('ui.ProjectView', () => {
  var Element = np.require('ui.Element'),
      Container = np.require('ui.Container'),
      View = np.require('ui.View'),
      ScenesListView = np.require('ui.ScenesListView'),
      RenderView = np.require('ui.RenderView');

  class ProjectView extends View {
    constructor(application, project) {
      super(application, 'div', 'app-project');

      this._scenesList = this.add(new ScenesListView(application, project.getScenes()));
      this._rightCol = this.add(new Container('div', 'app-right'));
      this._renderView = this._rightCol.add(new RenderView(application));
      this._editorView = this._rightCol.add(new Element('div', 'app-editor'));
    }
  }

  return ProjectView;
});
