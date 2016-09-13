np.define('ui.SceneView', (require) => {
  var Container = require('ui.Container'),
      Element = require('ui.Element'),
      Button = require('ui.Button'),
      StatesListView = require('ui.StatesListView'),
      Icon = require('ui.Icon'),
      State = require('model.State'),
      Scene = require('model.Scene');

  class SceneThumbnail extends Element {
    constructor(scene, thumbnail, width, height) {
      super('canvas', 'scene-thumbnail');

      this._scene = scene;
      this._thumbnail = thumbnail;
      this._width = width;
      this._height = height;
    }

    _createElement(doc, el) {
      super.createElement(doc, el);
      el.width = this._width * devicePixelRatio;
      el.height = this._height * devicePixelRatio;
      el.style.width = this._width + 'px';
      el.style.height = this._height + 'px';
      this._thumbnail.render(this._scene, el);
    }
  }

  class SceneView extends Container {
    constructor(scene, player, thumbnail) {
      super('div', 'app-scene');

      this._scene = scene;

      this._preview = this.add(new Container('div', 'app-scene-preview'));
      this._thumb = this._preview.add(new SceneThumbnail(scene, thumbnail, 128, 72));
      this._control = this._preview.add(new Container('div', 'app-scene-control'));
      this._settings = this._control.add(new Button('div', 'mini btn edit-scene', Icon.str('settings')));

      this._remove = this._control.add(new Button('div', 'mini btn delete-scene', Icon.str('delete_forever')));
      this._remove.onActivate(() => {
        var scene = this._scene,
            project = scene.getProject(),
            nextScene = scene.getPredecessor() || scene.getSuccessor();
        if (!nextScene) {
          nextScene = project.addScene(Scene.create(project));
        }
        if (player.getScene() === scene) {
          player.setState(nextScene.getState(0));
        }
        project.removeScene(scene);
      });

      this._statesList = this.add(new StatesListView(scene.getStates(), player));

      this.addState = this.add(new Button('div', 'round mini btn add-state', Icon.str('add')));
      this.addState.onActivate((evt) => {
        var added = scene.addState(State.create(scene));
        player.setState(added);
      });
    }

    getStatesList() {
      return this._statesList;
    }

    _createElement(doc, el) {
      super._createElement(doc, el);
      setTimeout(() => this.toggleClass('appear', true), 20);
    }
  }

  return SceneView;
});
