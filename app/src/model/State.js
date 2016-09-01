np.define('model.State', () => {
  var Element = np.require('doc.Element'),
      Value = np.require('doc.Value');

  class State extends Element {
    constructor(scene) {
      super(scene.getStates());

      this._scene = scene;
      this.setMember('duration', new Value(this, 0));
      this.setMember('inputs', new Element(this));
    }

    getProject() { return this.getDocument(); }

    getScene() { return this._scene; }

    getPredecessor(wrap) {
      var states = this.getParent(),
          index = states.indexOf(this);

      if (index > 0) {
        return states.get(index - 1);
      } else if (wrap) {
        return states.last();
      } else {
        return null;
      }
    }

    getSuccessor(wrap) {
      var states = this.getParent(),
          length = states.length,
          index = states.indexOf(this);

      if (index < length - 1) {
        return states.get(index + 1);
      } else if (wrap) {
        return states.first();
      } else {
        return null;
      }
    }

    getDuration() { return this.getMember('duration').getValue(); }

    setDuration(value) { return this.getMember('duration').setValue(value); }

    onDurationChanged(handler, ctx) { return this.getMember('duration').onChanged(handler, ctx); }

    getStart() { this.getScene().getStateStart(this); }

    static create(scene) {
      return new State(scene);
    }
  }

  return State;
});
