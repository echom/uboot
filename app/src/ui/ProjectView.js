np.define('ui.ProjectView', function() {
  var DomContainer = np.require('ui.DomContainer'),
      SceneView = np.require('ui.SceneView'),
      // RenderView = np.require('ui.RenderView'),
      ProjectView;


  ProjectView = np.inherits(function(project) {
    DomContainer.call(this, 'div', 'app-project');

    this._scenesList = this.append(new DomContainer('ul', 'app-scenes'));
    this._renderView = this.append(new DomContainer('div', 'app-render'));

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
