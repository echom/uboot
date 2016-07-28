np.define('model.Scene', () => {
  var Element = np.require('doc.Element'),
      List = np.require('doc.List'),
      State = np.require('model.State');

  class Scene extends Element {
    constructor(project) {
      super(project.getScenes());

      this._define('states', new List(this));

      this._duration = -1;
      this.onStatesChanged(() => { this._duration = -1; });

      this._renderState = {
        scene: new THREE.Scene(),
        camera: new THREE.PerspectiveCamera(75, project.getSettings().getAspect(), 0.1, 1000)
      };
    }

    getProject() {
      return this.getDocument();
    }

    getStates() {
      return this._members.states;
    }
    onStatesChanged(handler, ctx) {
      return this._members.states.onChanged(handler, ctx);
    }

    getDuration() {
      if (this._duration < 0) {
        this._duration = 0;
        this.getStates().forEach(state => this._duration += state.getDuration());
      }
      return this._duration;
    }

    getStateStart(state) {
      var offset = this.getProject().getSceneStart(this),
          states = this.getStates(),
          index = states.indexOf(state);
      if (index >= 0) {
        while (--index) {
          offset += states.get(index).getDuration();
        }
      }
      return offset;
    }

    getRenderState() { return this._renderState; }

    static create(project) {
      var scene = new Scene(project);
      scene.getStates().add(State.create(scene));
      scene.getStates().add(State.create(scene));
      scene.getStates().add(State.create(scene));
      return scene;
    }
  }

  return Scene;
});
