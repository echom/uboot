np.define('ui.ScenesListView', function() {
  var Container = np.require('ui.Container'),
      View = np.require('ui.View'),
      Button = np.require('ui.Button'),
      Scene = np.require('model.Scene'),
      SceneView = np.require('ui.SceneView'),
      ScenesListView,
      ScenesListItem;

  ScenesListItem = np.inherits(function(application, scene) {
    View.call(this, application, 'li', 'app-scenes-item');

    this._scene = scene;

    this._addSceneBefore = function() {
      var scenes = this._scene.getParent(),
          index = scenes.indexOf(this._scene);
      scenes.insertAt(Scene.new(this._scene.getProject()), index);
    }.bind(this);
    this._addSceneAfter = function() {
      var scenes = this._scene.getParent(),
          index = scenes.indexOf(this._scene);
      scenes.insertAt(Scene.new(this._scene.getProject()), index + 1);
    }.bind(this);

    this._addBefore = this.add(new Button('div', 'add-scene-before', '+', this._addSceneBefore));
    this._sceneView = this.add(new SceneView(application, scene));
    this._addAfter = this.add(new Button('div', 'add-scene-after', '+', this._addSceneAfter));
  }, View);

  ScenesListView = np.inherits(function(application, scenes) {
    View.call(this, application, 'div', 'ui app-scenes');

    this._scenes = scenes;
    this._list = this.add(new Container('ul'));

    scenes.forEach(function(scene) {
      this._list.add(new ScenesListItem(application, scene));
    }, this);
    scenes.onChanged().add(function(evt) {
      if (evt.removed) {
        this._list.removeAt(evt.index);
      }
      if (evt.added) {
        this._list.insertAt(new ScenesListItem(application, evt.added), evt.index);
      }
    }.bind(this));
  }, View);

  return ScenesListView;
});
