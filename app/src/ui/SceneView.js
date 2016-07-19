np.define('ui.SceneView', function() {
  var Element = np.require('ui.Element'),
      Container = np.require('ui.Container'),
      View = np.require('ui.View'),
      StateView = np.require('ui.StateView'),
      SceneView;

  SceneView = np.inherits(function(application, scene) {
    View.call(this, application, 'div', 'app-scene');

    this._scene = scene;

    this.add(new Element('div', 'app-scene-preview'));
    this._statesList = this.add(new Container('ul', 'app-states'));

    this._scene.getStates().forEach(function(state) {
      this._statesList.add(new StateView(application, state));
    }.bind(this));
    this._scene.onStatesChanged(function(evt) {
      if (evt.removed) {
        this._statesList.removeAt(evt.index);
      }
      if (evt.added) {
        this._statesList.insertAt(new StateView(application, evt.added), evt.index);
      }
    }.bind(this));
  }, View);


  SceneView.prototype._render = function(doc, el) {
    View.prototype._render.call(this, doc, el);

    setTimeout(function() { this.addClass('appear'); }.bind(this), 20);
  };

  return SceneView;
});
