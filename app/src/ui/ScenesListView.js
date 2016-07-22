np.define('ui.ScenesListView', function() {
  var Container = np.require('ui.Container'),
      View = np.require('ui.View'),
      Button = np.require('ui.Button'),
      Scene = np.require('model.Scene'),
      SceneView = np.require('ui.SceneView'),
      ScenesListView,
      ScenesListItem;

  ScenesListItem = np.inherits(function(application, scene) {
    View.call(this, application, 'li', 'app-scenes-item');

    this._scene = scene;

    this._addSceneBefore = function() {
      var scenes = this._scene.getParent(),
          index = scenes.indexOf(this._scene);
      scenes.insertAt(Scene.new(this._scene.getProject()), index);
    }.bind(this);
    this._addSceneAfter = function() {
      var scenes = this._scene.getParent(),
          index = scenes.indexOf(this._scene);
      scenes.insertAt(Scene.new(this._scene.getProject()), index + 1);
    }.bind(this);
    this._remScene = function() {
      var scenes = this._scene.getParent();
      scenes.remove(this._scene);
    }.bind(this);

    this._addBefore = this.add(new Button('div', 'add-scene-before', '+', this._addSceneBefore));
    // this._remove = this.add(new Button('div', 'rem-scene', 'x', this._remScene));
    this._sceneView = this.add(new SceneView(application, scene));
    this._addAfter = this.add(new Button('div', 'add-scene-after', '+', this._addSceneAfter));
  }, View);

  ScenesListView = np.inherits(function(application, scenes) {
    View.call(this, application, 'div', 'ui app-scenes');

    this._scenes = scenes;
    this._list = this.add(new Container('ul'));

    this._selection = application.getSelection().getGroup('scenes');
    this._onSelect = this._onSelect.bind(this);
    this._selection.onChanged(function(evt) {
      this._list.getChildren().forEach(function(i) {
        i.toggleClass('selected', this._selection.contains(i._scene));
      }, this);
    }, this);


    scenes.forEach(function(scene) {
      this._list.add(new ScenesListItem(application, scene));
    }, this);
    scenes.onChanged(function(evt) {
      if (evt.removed) {
        this._list.removeAt(evt.index);
      }
      if (evt.added) {
        this._list.insertAt(new ScenesListItem(application, evt.added), evt.index);
      }
    }.bind(this));
  }, View);


  ScenesListView.prototype._render = function(doc, el) {
    View.prototype._render.call(this, doc, el);

    this._list.getChildren().forEach(function(child) {
      child.getElement().addEventListener('mouseup', this._onSelect);
    }, this);
  };

  ScenesListView.prototype._onSelect = function(evt) {
    var type = evt.shiftKey ? 'range' : (evt.ctrlKey || evt.metaKey) ? 'add' : 'single',
        selection = this._selection,
        item = this._list.getChildren().find(function(i) {
          return i.getElement() === evt.currentTarget;
        });

    if (type === 'single') {
      selection.set(item._scene);
    } else if (type === 'add') {
      selection.toggle(item._scene);
    } else if (type === 'range') {
      console.log('oops');
    }
  };

  return ScenesListView;
});
