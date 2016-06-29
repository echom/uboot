np.define('model.Scene', function() {
  var List = np.require('doc.List'),
      Element = np.require('doc.Element'),
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

  return Scene;
});
