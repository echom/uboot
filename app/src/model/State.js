np.define('model.State', function() {
  var Element = np.require('doc.Element'),
      Value = np.require('doc.Value'),
      State;

  State = np.inherits(function(scene) {
    Element.call(this, scene.getStates());

    this._scene = scene;
    this._define('duration', new Value(this, 0));
  }, Element);

  State.prototype.getProject = function() {
    return this.getDocument();
  };

  State.prototype.getScene = function() {
    return this._scene;
  };

  State.prototype.getDuration = function() {
    return this._members.duration.getValue();
  };
  State.prototype.setDuration = function(value) {
    return this._members.duration.setValue(value);
  };
  State.prototype.getStart = function() {
    this.getScene().getStateStart(this);
  };

  State.new = function(scene) {
    return new State(scene);
  };

  return State;
});
