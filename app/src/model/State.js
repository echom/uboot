np.define('model.State', () => {
  var Element = np.require('doc.Element'),
      Value = np.require('doc.Value');

  class State extends Element {
    constructor(scene) {
      super(scene.getStates());

      this._scene = scene;
      this._define('duration', new Value(this, 0));
    }

    getProject() { return this.getDocument(); }

    getScene() { return this._scene; }

    getDuration() { return this._members.duration.getValue(); }

    setDuration(value) { return this._members.duration.setValue(value); }

    onDurationChanged(handler, ctx) { return this._members.duration.onChanged(handler, ctx); }

    getStart() { this.getScene().getStateStart(this); }

    static create(scene) {
      return new State(scene);
    }
  }

  return State;
});
