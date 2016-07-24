np.define('ui.ScenesListView', () => {
  var Button = np.require('ui.Button'),
      ListView = np.require('ui.ListView'),
      Scene = np.require('model.Scene'),
      SceneView = np.require('ui.SceneView');

  class SceneItemView extends ListView.ItemView {
    constructor(application, scene) {
      super(application, scene, 'li', 'app-scenes-item');

      this._addBefore = this.add(new Button('div', 'add-scene-before', '+'));
      this._sceneView = this.add(new SceneView(application, scene));
      this._addAfter = this.add(new Button('div', 'add-scene-after', '+'));

      this._addBefore.onActivate(evt => {
        var scene = this.getItem(),
            scenes = scene.getParent(),
            index = scenes.indexOf(scene);
        scenes.insertAt(Scene.create(scene.getProject()), index);
      });
      this._addAfter.onActivate(evt => {
        var scene = this.getItem(),
            scenes = scene.getParent(),
            index = scenes.indexOf(scene);
        scenes.insertAt(Scene.create(scene.getProject()), index + 1);
      });
    }
  }

  class ScenesListView extends ListView {
    constructor(application, scenes) {
      super(application, scenes, 'multi', 'ul', 'ui app-scenes');
    }

    _createItemView(scene) {
      return new SceneItemView(this.getApplication(), scene);
    }

    _onItemSelected(evt, src) {
      var player = this.getApplication().getPlayer(),
          scene = src.getItem();

      super._onItemSelected(evt, src);

      if (evt.type === 'single' && player.getScene() !== scene) {
        player.setState(scene.getStates().get(0));
      }
    }
  }

  return ScenesListView;
});
