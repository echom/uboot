np.define('ui.SceneView', () => {
  var Element = np.require('ui.Element'),
      View = np.require('ui.View'),
      StatesListView = np.require('ui.StatesListView');

  class SceneView extends View {
    constructor(application, scene) {
      super(application, 'div', 'app-scene');

      this._scene = scene;

      this.add(new Element('div', 'app-scene-preview', '' + scene.getParent().indexOf(scene)));
      this._statesList = this.add(new StatesListView(application, scene.getStates()));
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
