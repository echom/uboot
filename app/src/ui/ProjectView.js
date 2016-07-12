np.define('ui.ProjectView', function() {
  var Element = np.require('ui.Element'),
      Container = np.require('ui.Container'),
      View = np.require('ui.View'),
      ScenesListView = np.require('ui.ScenesListView'),
      RenderView = np.require('ui.RenderView'),
      ProjectView;

  ProjectView = np.inherits(function(application, project) {
    View.call(this, application, 'div', 'app-project');

    this._scenesList = this.add(new ScenesListView(application, project.getScenes()));
    this._rightCol = this.add(new Container('div', 'app-right'));
    this._renderView = this._rightCol.add(new RenderView(application));
    this._editorView = this._rightCol.add(new Element('div', 'app-editor'));
  }, View);

  return ProjectView;
});
