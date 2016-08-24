np.define('app.Player', () => {
  var Observable = np.require('np.Observable');

  class Player {
    constructor(project) {
      this._project = project;

      this._scene = new Observable(null, this);
      this._state = new Observable(null, this);
      this._running = new Observable(false, this);
      this._looping = false;

      this.setState(project.getScene(0).getState(0));
    }

    getScene() { return this._scene.getValue(); }

    onSceneChanged(handler, ctx) {
      return this._scene.onChanged(handler, ctx);
    }

    getState() { return this._state.getValue(); }

    setState(state) {
      this._scene.setValue(state.getScene());
      this._state.setValue(state);
      return this;
    }

    onStateChanged(handler, ctx) {
      return this._state.onChanged(handler, ctx);
    }

    isRunning() { return this._running.getValue(); }

    onRunningChanged(handler, ctx) {
      return this._running.onChanged(handler, ctx);
    }

    isLooping() { return this._looping; }

    setLooping(value) {
      this._looping = value;
      return this;
    }

    start(state) {
      var reference = state;
      if (!state) {
        reference = this._project.getScene(0).getState(0);
      }
      this.setState(reference);
      this._running.setValue(true);
      return this;
    }

    stop() {
      this._running.setValue(false);
      return this;
    }

    next() {
      var nextState = this.getState().getSuccessor(),
          nextScene = !nextState ? this.getScene().getSuccessor() : null;

      if (nextState) {
        this.setState(nextState);
      } else if (nextScene) {
        this.setState(nextScene.getState(0));
      } else if (this.isLooping) {
        this.setState(this._project.getScene(0).getState(0));
      } else {
        this._running.setValue(false);
      }

      return this;
    }
  }

  return Player;
});
