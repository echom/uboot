np.define('ui.ScenesListView', () => {
  var Button = np.require('ui.Button'),
      List = np.require('ui.List'),
      Scene = np.require('model.Scene'),
      SceneView = np.require('ui.SceneView');

  class ScenesListItem extends List.Item {
    constructor(scene, player) {
      super('li', 'app-scenes-item');

      this._addBefore = this.add(new Button('div', 'add-scene-before', '+'));
      this._sceneView = this.add(new SceneView(scene, player));
      this._addAfter = this.add(new Button('div', 'add-scene-after', '+'));

      this._addBefore.onActivate(evt => {
        var scenes = scene.getParent(),
            index = scenes.indexOf(scene);
        scenes.insertAt(Scene.create(scene.getProject()), index);
      });
      this._addAfter.onActivate(evt => {
        var scenes = scene.getParent(),
            index = scenes.indexOf(scene);
        scenes.insertAt(Scene.create(scene.getProject()), index + 1);
      });

      this.toggleClass('current', player.getScene() === scene);
      player.onSceneChanged(evt => {
        this.toggleClass('current', evt.newValue === scene);
      });
    }

    onStateSelectionChanged(handler, ctx) {
      return this._sceneView.getStatesList().onSelectionChanged(handler, ctx);
    }

    setSelected(value, force) {
      super.setSelected(value, force);
      if (!value) {
        this._sceneView.getStatesList().clearSelection();
      }
    }
  }

  class ScenesListView extends List {
    constructor(scenes, player) {
      super('ul', List.MULTI_SELECT, 'ui app-scenes');

      this._scenes = scenes;
      this._player = player;

      scenes.forEach(scene => this.add(this._createItem(scene)));
      scenes.onChanged(evt => {
        if (evt.removed) {
          this.removeAt(evt.index);
        }
        if (evt.added) {
          this.insertAt(this._createItem(evt.added), evt.index);
        }
      });
    }

    _createItem(scene) {
      var item = new ScenesListItem(scene, this._player);
      return item;
    }

    _modifySelection(index, type) {
      var player = this._player,
          scene = this._scenes.get(index);

      super._modifySelection(index, type);

      if (type === 'single' && player.getScene() !== scene) {
        player.setState(scene.getStates().get(0));
      }
    }
  }

  return ScenesListView;
});
