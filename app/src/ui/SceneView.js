np.define('ui.SceneView', () => {
  var Element = np.require('ui.Element'),
      Container = np.require('ui.Container'),
      View = np.require('ui.View'),
      StateView = np.require('ui.StateView');

  class SceneView extends View {
    constructor(application, scene) {
      super(application, 'div', 'app-scene');

      this._scene = scene;

      this.add(new Element('div', 'app-scene-preview', '' + scene.getParent().indexOf(scene)));
      this._statesList = this.add(new Container('ul', 'app-states'));

      this._scene.getStates().forEach(state => {
        this._statesList.add(new StateView(application, state));
      });
      this._scene.onStatesChanged(evt => {
        if (evt.removed) {
          this._statesList.removeAt(evt.index);
        }
        if (evt.added) {
          this._statesList.insertAt(new StateView(application, evt.added), evt.index);
        }
      });
    }

    _render(doc, el) {
      super._render(doc, el);
      setTimeout(() => this.toggleClass('appear', true), 20);
    }
  }

  return SceneView;
});
