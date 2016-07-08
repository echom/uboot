np.define('ui.SceneView', function() {
  var DomRenderable = np.require('ui.DomRenderable'),
      DomContainer = np.require('ui.DomContainer'),
      Button = np.require('ui.Button'),
      SelectionBehavior = np.require('ui.SelectionBehavior'),
      SceneView;

  SceneView = np.inherits(function(scene) {
    DomContainer.call(this, 'li', 'app-scene');

    this._scene = scene;

    this._selectionBehavior = new SelectionBehavior();
    this._selectionBehavior.onStateChanged().add(function(evt) {
      this.toggleClass('selected', evt.newValue === 'selected');
    }.bind(this));

    this.append(new Button('div', 'add-scene-before').setContent('+'));
    this.append(new DomRenderable('div', 'app-scene-preview'));
    this.append(new Button('div', 'add-scene-after').setContent('+'));
  }, DomContainer);


  SceneView.prototype._render = function(doc, el) {
    DomContainer.prototype._render.call(this, doc, el);
    this._selectionBehavior.enable(el);
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
