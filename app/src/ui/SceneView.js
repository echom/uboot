np.define('ui.SceneView', () => {
  var Container = np.require('ui.Container'),
      Button = np.require('ui.Button'),
      StatesListView = np.require('ui.StatesListView'),
      Icon = np.require('ui.Icon'),
      State = np.require('model.State');

  class SceneView extends Container {
    constructor(scene, player) {
      super('div', 'app-scene');

      this._scene = scene;

      this._preview = this.add(new Container('div', 'app-scene-preview'));
      this._control = this._preview.add(new Container('div', 'app-scene-control'));
      this._settings = this._control.add(new Button('div', 'mini btn edit-scene', Icon.str('settings')));

      this._remove = this._control.add(new Button('div', 'mini btn delete-scene', Icon.str('delete_forever')));
      this._remove.onActivate(() => {
        
      });

      this._statesList = this.add(new StatesListView(scene.getStates(), player));

      this.addState = this.add(new Button('div', 'round mini btn add-state', Icon.str('add')));
      this.addState.onActivate((evt) => scene.getStates().add(State.create(scene)));
    }

    getStatesList() {
      return this._statesList;
    }

    _render(doc, el) {
      super._render(doc, el);
      setTimeout(() => this.toggleClass('appear', true), 20);
    }
  }

  return SceneView;
});
