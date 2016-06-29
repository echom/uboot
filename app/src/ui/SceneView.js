np.define('ui.SceneView', function() {
  var DomContainer = np.require('ui.DomContainer'),
      SceneView;

  SceneView = np.inherits(function(scene) {
    DomContainer.call(this, 'ul', 'app-scene');

    this._scene = scene;
  }, DomContainer);

  return SceneView;
});