np.define('ui.ProjectView', function() {
  var DomRenderable = np.require('ui.DomRenderable'),
      DomContainer = np.require('ui.DomContainer'),
      ScenesListView = np.require('ui.ScenesListView'),
      RenderView = np.require('ui.RenderView'),
      ProjectView;

  ProjectView = np.inherits(function(project) {
    DomContainer.call(this, 'div', 'app-project');

    this._scenesList = this.append(new ScenesListView(project.getScenes()));
    this._rightCol = this.append(new DomContainer('div', 'app-right'));
    this._renderView = this._rightCol.append(new RenderView());
    this._editorView = this._rightCol.append(new DomRenderable('div', 'app-editor'));
  }, DomContainer);

  return ProjectView;
});
