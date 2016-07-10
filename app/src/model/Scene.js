np.define('model.Scene', function() {
  var Element = np.require('doc.Element'),
      List = np.require('doc.List'),
      State = np.require('model.State'),
      Scene;

  Scene = np.inherits(function(project) {
    Element.call(this, project.getScenes());

    this._define('states', new List(this));

    this._duration = -1;
    this.onStatesChanged().add(function() {
      this._duration = -1;
    }.bind());
  }, Element);

  Scene.prototype.getProject = function() {
    return this.getDocument();
  };

  Scene.prototype.getStates = function() {
    return this._members.states;
  };
  Scene.prototype.onStatesChanged = function() {
    return this._members.states.onChanged();
  };

  Scene.prototype.getDuration = function() {
    if (this._duration < 0) {
      this._duration = 0;
      this.getStates().forEach(function(state) {
        this._duration += state.getDuration();
      }, this);
    }
    return this._duration;
  };

  Scene.prototype.getStateStart = function(state) {
    var offset = this.getProject().getSceneStart(this),
        states = this.getStates(),
        index = states.indexOf(state);
    if (index >= 0) {
      while (--index) {
        offset += states.at(index).getDuration();
      }
    }
    return offset;
  };

  Scene.new = function(project) {
    var scene = new Scene(project);
    scene.getStates().add(State.new(scene));
    scene.getStates().add(State.new(scene));
    scene.getStates().add(State.new(scene));
    return scene;
  };

  return Scene;
});
