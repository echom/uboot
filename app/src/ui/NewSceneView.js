np.define('ui.NewSceneView', function() {
  var Container = np.require('ui.Container'),
      View = np.require('ui.View'),
      NewSceneView;

  NewSceneView = np.inherits(function(application, scene) {
    View.call(this, application, 'div', 'new-scene-view');

    this.menu = this.add(new Container('div', 'new-scene-menu'));
    this.preview = this.add(new Container('div', 'new-scene-preview'));
    this.states = this.add(new Container('ul', 'new-scene-states'));

    this._bindScene(scene);
  }, View);

  NewSceneView.prototype._bindScene = function(scene) {
    scene.getStates().forEach(function(state) {

    });
    scene.onStatesChanged(handler, ctx);;
  };

  return NewSceneView;
});
