np.define('app.Player', function() {
  var Observable = np.require('np.Observable'),
      Player;

  Player = function(project) {
    this._project = project;

    this._scene = new Observable(null, this);
    this._state = new Observable(null, this);
    this._running = false;
    this._looping = false;
  };

  Player.prototype.getScene = function() {
    return this._scene.getValue();
  };
  Player.prototype.onSceneChanged = function() {
    return this._scene.onChanged();
  };

  Player.prototype.getState = function() {
    return this._state.getValue();
  };
  Player.prototype.setState = function(state) {
    this._scene.setValue(state.getScene());
    this._state.setValue(state);
    return this;
  };
  Player.prototype.onStateChanged = function() {
    return this._scene.onChanged();
  };

  Player.prototype.isRunning = function() {
    return this._running;
  };
  Player.prototype.isLooping = function() {
    return this._looping;
  };
  Player.prototype.setLooping = function(value) {
    this._looping = value;
    return this;
  };

  Player.prototype.start = function(state) {
    var reference = state;
    if (!state) {
      reference = this._project
        .getScenes()
        .at(0)
        .getStates()
        .at(0);
    }
    this.setState(reference);
    this._running = true;
    return this;
  };
  Player.prototype.stop = function() {
    this._running = false;
    return this;
  };

  Player.prototype.next = function() {
    var scenes = this._project.getScenes(),
        states = this.getScene().getStates(),
        index;

    if (this._running) {
      index = states.indexOf(this.getState());
      if (index < states.length - 1) {
        this.setState(states.at(index + 1));
      } else {
        index = scenes.indexOf(this.getScene());
        if (index < scenes.length - 1) {
          states = scenes.at(index + 1).getStates();
          this.setState(states.at(0));
        } else if (this.isLooping()) {
          states = scenes.at(0).getStates();
          this.setState(states.at(0));
        } else {
          this._running = false;
        }
      }
    }
    return this;
  };

  return Player;
});
