np.define('ui.ScenesListView', function() {
  var DomRenderable = np.require('ui.DomRenderable'),
      DomContainer = np.require('ui.DomContainer'),
      Button = np.require('ui.Button'),
      Scene = np.require('model.Scene'),
      SceneView = np.require('ui.SceneView'),
      ScenesListView,
      ScenesListItem;

  ScenesListItem = np.inherits(function(scene) {
    DomContainer.call(this, 'li', 'app-scenes-item');

    this._scene = scene;

    this._addBefore = this.append(new Button('div', 'add-scene-before').setContent('+'));
    this._addBefore.onStateChanged().add(function(evt) {
      var scenes,
          index;
      if (evt.newValue === Button.STATE_UP) {
        scenes = this._scene.getParent();
        index = scenes.indexOf(this._scene);
        scenes.insertAt(Scene.new(this._scene.getProject()), index);
      }
    }.bind(this));

    this._sceneView = this.append(new SceneView(scene));

    this._addAfter = this.append(new Button('div', 'add-scene-after').setContent('+'));
    this._addAfter.onStateChanged().add(function(evt) {
      var scenes,
          index;
      if (evt.newValue === Button.STATE_UP) {
        scenes = this._scene.getParent();
        index = scenes.indexOf(this._scene);
        scenes.insertAt(Scene.new(this._scene.getProject()), index + 1);
      }
    }.bind(this));
  }, DomContainer);

  ScenesListView = np.inherits(function(scenes) {
    DomRenderable.call(this, 'div', 'ui app-scenes');

    this._scenes = scenes;
    this._list = new DomContainer('ul');

    scenes.forEach(function(scene) {
      this._list.append(new ScenesListItem(scene));
    }, this);
    scenes.onChanged().add(function(evt) {
      if (evt.removed) {
        this._list.removeAt(evt.index);
      }
      if (evt.added) {
        this._list.insertAt(new ScenesListItem(evt.added), evt.index);
      }
    }.bind(this));
  }, DomRenderable);

  ScenesListView.prototype._render = function(doc, el) {
    DomRenderable.prototype._render.call(this, doc, el);
    el.appendChild(this._list.render(doc));
  };

  return ScenesListView;
});
