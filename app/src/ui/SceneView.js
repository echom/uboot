np.define('ui.SceneView', function() {
  var DomRenderable = np.require('ui.DomRenderable'),
      DomContainer = np.require('ui.DomContainer'),
      Button = np.require('ui.Button'),
      SelectionBehavior = np.require('ui.SelectionBehavior'),
      Scene = np.require('model.Scene'),
      SceneView;

  SceneView = np.inherits(function(scene) {
    DomContainer.call(this, 'li', 'app-scene');

    this._scene = scene;

    this._selectionBehavior = new SelectionBehavior();
    this._selectionBehavior.onStateChanged().add(function(evt) {
      this.toggleClass('selected', evt.newValue === 'selected');
    }.bind(this));

    this._addBefore = new Button('div', 'add-scene-before').setContent('+');
    this._addBefore.onStateChanged().add(function(evt) {
      var scenes,
          index;
      if (evt.newValue === Button.STATE_UP) {
        scenes = this._scene.getParent();
        index = scenes.indexOf(this._scene);
        scenes.insertAt(Scene.new(), index);
      }
    }.bind(this));
    this._addAfter = new Button('div', 'add-scene-after').setContent('+');
    this._addAfter.onStateChanged().add(function(evt) {
      var scenes,
          index;
      if (evt.newValue === Button.STATE_UP) {
        scenes = this._scene.getParent();
        index = scenes.indexOf(this._scene);
        scenes.insertAt(Scene.new(), index + 1);
      }
    }.bind(this));

    this._statesList = new DomContainer('ul', 'app-states');

    this._scene.getStates().forEach(function(state) {
      this._statesList.append(new DomRenderable('li', 'app-state'));
    }.bind(this));
    this._scene.onStatesChanged().add(function(evt) {
      if (evt.removed) {
        this._statesList.removeAt(evt.index);
      }
      if (evt.added) {
        this._statesList.insertAt(new DomRenderable('li', 'app-state'), evt.index);
      }
    }.bind(this));

    this.append(this._addBefore);
    this.append(new DomRenderable('div', 'app-scene-preview'));
    this.append(this._statesList);
    this.append(this._addAfter);
  }, DomContainer);


  SceneView.prototype._render = function(doc, el) {
    DomContainer.prototype._render.call(this, doc, el);
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
