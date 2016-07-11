np.define('ui.ScenesListView', function() {
  var DomContainer = np.require('ui.DomContainer'),
      View = np.require('ui.View'),
      Button = np.require('ui.Button'),
      Scene = np.require('model.Scene'),
      SceneView = np.require('ui.SceneView'),
      ScenesListView,
      ScenesListItem;

  ScenesListItem = np.inherits(function(application, scene) {
    View.call(this, application, 'li', 'app-scenes-item');

    this._scene = scene;

    this._addBefore = this.append(new Button('div', 'add-scene-before').setContent('+'));
    this._addBefore.onStateChanged().add(function(evt) {
      var scenes,
          index;
      if (evt.newValue === Button.STATE_UP) {
        scenes = this._scene.getParent();
        index = scenes.indexOf(this._scene);
        scenes.insertAt(Scene.new(this._scene.getProject()), index);
      }
    }.bind(this));

    this._sceneView = this.append(new SceneView(application, scene));

    this._addAfter = this.append(new Button('div', 'add-scene-after').setContent('+'));
    this._addAfter.onStateChanged().add(function(evt) {
      var scenes,
          index;
      if (evt.newValue === Button.STATE_UP) {
        scenes = this._scene.getParent();
        index = scenes.indexOf(this._scene);
        scenes.insertAt(Scene.new(this._scene.getProject()), index + 1);
      }
    }.bind(this));
  }, View);

  ScenesListView = np.inherits(function(application, scenes) {
    View.call(this, application, 'div', 'ui app-scenes');

    this._scenes = scenes;
    this._list = this.append(new DomContainer('ul'));

    scenes.forEach(function(scene) {
      this._list.append(new ScenesListItem(application, scene));
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
