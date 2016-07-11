np.define('ui.ProjectView', function() {
  var DomRenderable = np.require('ui.DomRenderable'),
      DomContainer = np.require('ui.DomContainer'),
      View = np.require('ui.View'),
      ScenesListView = np.require('ui.ScenesListView'),
      RenderView = np.require('ui.RenderView'),
      ProjectView;

  ProjectView = np.inherits(function(application, project) {
    View.call(this, application, 'div', 'app-project');

    this._scenesList = this.append(new ScenesListView(application, project.getScenes()));
    this._rightCol = this.append(new DomContainer('div', 'app-right'));
    this._renderView = this._rightCol.append(new RenderView(application));
    this._editorView = this._rightCol.append(new DomRenderable('div', 'app-editor'));
  }, View);

  return ProjectView;
});
