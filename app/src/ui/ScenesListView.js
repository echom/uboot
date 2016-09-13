np.define('ui.ScenesListView', () => {
  var Button = np.require('ui.Button'),
      List = np.require('ui.List'),
      Scene = np.require('model.Scene'),
      SceneView = np.require('ui.SceneView'),
      Thumbnail = np.require('render.Thumbnail');

  class ScenesListItem extends List.Item {
    constructor(scene, player, thumbnail) {
      super('li', 'app-scenes-item');

      this._addBefore = this.add(new Button('div', 'add-scene-before', '+'));
      this._sceneView = this.add(new SceneView(scene, player, thumbnail));
      this._addAfter = this.add(new Button('div', 'add-scene-after', '+'));

      this._addBefore.onActivate(evt => {
        var scenes = scene.getParent(),
            index = scenes.indexOf(scene),
            added = scenes.insertAt(Scene.create(scene.getProject()), index);

        player.setState(added.getState(0));
      });
      this._addAfter.onActivate(evt => {
        var scenes = scene.getParent(),
            index = scenes.indexOf(scene),
            added = scenes.insertAt(Scene.create(scene.getProject()), index + 1);
        player.setState(added.getState(0));
      });

      this.toggleClass('current', player.getScene() === scene);
      player.onSceneChanged(evt => {
        this.toggleClass('current', evt.value === scene);
      });
    }

    getStatesList() { return this._sceneView.getStatesList(); }
  }

  class ScenesListView extends List {
    constructor(scenes, player, renderer) {
      super('ul', List.multiSelection, 'ui app-scenes');

      this._scenes = scenes;
      this._player = player;
      this._thumbnail = new Thumbnail(renderer);

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
      var item = new ScenesListItem(scene, this._player, this._thumbnail);

      item.getStatesList().onSelectionChanged(evt => {
        if (evt.added.length) {
          this.getChildren().forEach(child => {
            if (child !== item) {
              child.getStatesList().clearSelection();
            }
          });
          this.clearSelection();
        }
      });

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
