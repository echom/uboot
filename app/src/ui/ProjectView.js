np.define('ui.ProjectView', function() {
  var DomRenderable = np.require('ui.DomRenderable'),
      DomContainer = np.require('ui.DomContainer'),
      SceneView = np.require('ui.SceneView'),
      RenderView = np.require('ui.RenderView'),
      ProjectView;

  ProjectView = np.inherits(function(project) {
    DomContainer.call(this, 'div', 'app-project');

    this._scenesList = this.append(new DomContainer('ul', 'app-scenes'));
    this._rightCol = this.append(new DomContainer('div', 'app-right'));
    this._renderView = this._rightCol.append(new RenderView());
    this._editorView = this._rightCol.append(new DomRenderable('div', 'app-editor'));

    project.getScenes().forEach(function(scene) {
      this._scenesList.append(new SceneView(scene));
    }, this);
    project.onScenesChanged().add(function(evt) {
      if (evt.removed) {
        this._scenesList.removeAt(evt.index);
      }
      if (evt.added) {
        this._scenesList.insertAt(new SceneView(evt.added), evt.index);
      }
    });
  }, DomContainer);

  return ProjectView;
});
