np.define('ui.SceneView', () => {
  var Element = np.require('ui.Element'),
      Container = np.require('ui.Container'),
      StatesListView = np.require('ui.StatesListView');

  class SceneView extends Container {
    constructor(scene, player) {
      super('div', 'app-scene');

      this._scene = scene;

      this.add(new Element('div', 'app-scene-preview', '' + scene.getParent().indexOf(scene)));
      this._statesList = this.add(new StatesListView(scene.getStates(), player));
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
