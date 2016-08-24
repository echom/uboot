np.define('ui.SceneView', () => {
  var Container = np.require('ui.Container'),
      Button = np.require('ui.Button'),
      StatesListView = np.require('ui.StatesListView'),
      Icon = np.require('ui.Icon'),
      State = np.require('model.State'),
      Scene = np.require('model.Scene');

  class SceneView extends Container {
    constructor(scene, player) {
      super('div', 'app-scene');

      this._scene = scene;

      this._preview = this.add(new Container('div', 'app-scene-preview'));
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
