np.define('ui.ScenesListView', function() {
  var DomRenderable = np.require('ui.DomRenderable'),
      DomContainer = np.require('ui.DomContainer'),
      Button = np.require('ui.Button'),
      Scene = np.require('model.Scene'),
      SceneView = np.require('ui.SceneView'),
      ScenesListView;

  ScenesListView = np.inherits(function(scenes) {
    DomRenderable.call(this, 'div', 'app-scenes');

    this._scenes = scenes;
    this._list = new DomContainer('ul');
    this._newButton = new Button().setContent('+');
    this._newButton.onStateChanged().add(function(evt) {
      if (evt.newValue === Button.BUTTON_STATE_UP) {
        scenes.add(Scene.new());
      }
    });

    scenes.forEach(function(scene) {
      this._list.append(new SceneView(scene));
    }, this);
    scenes.onChanged().add(function(evt) {
      if (evt.removed) {
        this._list.removeAt(evt.index);
      }
      if (evt.added) {
        this._list.insertAt(new SceneView(evt.added), evt.index);
      }
    }.bind(this));
  }, DomRenderable);

  ScenesListView.prototype._render = function(doc, el) {
    DomRenderable.prototype._render.call(this, doc, el);
    el.appendChild(this._list.render(doc));
    el.appendChild(this._newButton.render(doc));
  };

  return ScenesListView;
});
