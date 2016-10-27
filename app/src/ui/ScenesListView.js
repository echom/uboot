np.define('ui.ScenesListView', () => {
  var Button = np.require('ui.Button'),
      List = np.require('ui.List'),
      Scene = np.require('model.Scene'),
      SceneView = np.require('ui.SceneView'),
      Thumbnail = np.require('render.Thumbnail');

  class ScenesListItem extends List.Item {
    constructor(application, scene, thumbnail) {
      var player = application.getPlayer();
      super('li', 'app-scenes-item');

      this._addBefore = this.add(new Button('div', 'add-scene-before', '+'));
      this._sceneView = this.add(new SceneView(application, scene, thumbnail));
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
    constructor(application) {
      super('ul', List.multiSelection, 'ui app-scenes');

      this._application = application;
      this._scenes = this._application.getProject().getScenes();
      this._thumbnail = new Thumbnail(this._application.getRenderer());

      this._scenes.forEach(scene => this.add(this._createItem(scene)));
      this._scenes.onChanged(evt => {
        if (evt.removed) {
          this.removeAt(evt.index);
        }
        if (evt.added) {
          this.insertAt(this._createItem(evt.added), evt.index);
        }
      });
    }

    _createItem(scene) {
      var item = new ScenesListItem(this._application, scene, this._thumbnail);

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
      var player = this._application.getPlayer(),
          scene = this._scenes.get(index);

      super._modifySelection(index, type);

      if (type === 'single' && player.getScene() !== scene) {
        player.setState(scene.getStates().get(0));
      }
    }
  }

  return ScenesListView;
});
