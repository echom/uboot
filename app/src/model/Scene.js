np.define('model.Scene', () => {
  var Element = np.require('doc.Element'),
      List = np.require('doc.List'),
      State = np.require('model.State');

  class Scene extends Element {
    constructor(project) {
      super(project.getScenes());

      this._define('states', new List(this));
      this._define('entities', new List(this));

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

    getPredecessor(wrap) {
      var scenes = this.getParent(),
          index = scenes.indexOf(this);

      if (index > 0) {
        return scenes.get(index - 1);
      } else if (wrap) {
        return scenes.last();
      } else {
        return null;
      }
    }

    getSuccessor(wrap) {
      var scenes = this.getParent(),
          length = scenes.length,
          index = scenes.indexOf(this);

      if (index < length - 1) {
        return scenes.get(index + 1);
      } else if (wrap) {
        return scenes.first();
      } else {
        return null;
      }
    }

    getStates() { return this._members.states; }
    getState(index) { return this.getStates().get(index); }
    onStatesChanged(handler, ctx) { return this.getStates().onChanged(handler, ctx); }
    addState(state) { return this.getStates().add(state); }
    insertStateAt(state, index) { return this.getStates().insertAt(state, index); }
    removeState(state) { return this.getStates().remove(state); }
    removeStateAt(index) { return this.getStates().removeAt(index); }

    getEntities() { return this._members.entities; }
    onEntitiesChanged(handler, ctx) { return this._members.entities.onChanged(handler, ctx); }

    getRenderState() { return this._renderState; }

    static create(project) {
      var scene = new Scene(project),
          BoxEntity = np.require('entities.BoxEntity');
      scene.addState(State.create(scene));
      scene.getEntities().add(new BoxEntity(scene));
      return scene;
    }
  }

  return Scene;
});
