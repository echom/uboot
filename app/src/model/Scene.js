np.define('model.Scene', function() {
  var Element = np.require('doc.Element'),
      List = np.require('doc.List'),
      State = np.require('model.State'),
      Scene;

  Scene = np.inherits(function(project) {
    Element.call(this, project);

    this._define('states', new List(this));
  }, Element);

  Scene.prototype.getProject = function() {
    return this.doc;
  };

  Scene.prototype.getStates = function() {
    return this._members.states;
  };
  Scene.prototype.onStatesChanged = function() {
    return this._members.states.onChanged();
  };

  Scene.new = function() {
    var scene = new Scene();
    scene.getStates().add(State.new());
    scene.getStates().add(State.new());
    scene.getStates().add(State.new());
    return scene;
  };

  return Scene;
});
