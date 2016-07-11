np.define('ui.SceneView', function() {
  var DomRenderable = np.require('ui.DomRenderable'),
      DomContainer = np.require('ui.DomContainer'),
      View = np.require('ui.View'),
      StateView = np.require('ui.StateView'),
      SelectionBehavior = np.require('ui.SelectionBehavior'),
      // Scene = np.require('model.Scene'),
      SceneView;

  SceneView = np.inherits(function(application, scene) {
    View.call(this, application, 'div', 'app-scene');

    this._scene = scene;

    this._selectionBehavior = new SelectionBehavior();
    this._selectionBehavior.onStateChanged().add(function() {
      this.toggleClass('selected');
    }.bind(this));

    this._statesList = new DomContainer('ul', 'app-states');

    this._scene.getStates().forEach(function(state) {
      this._statesList.append(new StateView(application, state));
    }.bind(this));
    this._scene.onStatesChanged().add(function(evt) {
      if (evt.removed) {
        this._statesList.removeAt(evt.index);
      }
      if (evt.added) {
        this._statesList.insertAt(new StateView(application, evt.added), evt.index);
      }
    }.bind(this));

    this.append(new DomRenderable('div', 'app-scene-preview'));
    this.append(this._statesList);
  }, View);


  SceneView.prototype._render = function(doc, el) {
    View.prototype._render.call(this, doc, el);
    this._selectionBehavior.enable(el);

    setTimeout(function() { this.addClass('appear'); }.bind(this), 20);
  };

  SceneView.prototype.setEnabled = function(enabled, force) {
    if (((enabled != this.isEnabled()) || force) && this._element) {
      if (enabled) {
        this._selectionBehavior.enable(this._element);
      } else {
        this._selectionBehavior.disable();
      }
    }
    DomContainer.prototype.setEnabled.call(this, enabled, force);
    return this;
  };

  return SceneView;
});
