np.define('model.Scene', (require, name) => {
  var DocElement = require('np.DocElement'),
      DocList = require('np.DocList'),
      State = require('model.State'),
      SceneRenderState = require('render.SceneRenderState');

  class Scene extends DocElement {
    constructor() {
      super();

      this.setMember('states', new DocList());
      this.setMember('entities', new DocList());

      this._duration = -1;
      this.onStatesChanged(() => { this._duration = -1; });

      this._renderState = null;
    }

    getProject() {
      return this.getRoot();
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

    getStates() { return this.getMember('states'); }
    getState(index) { return this.getStates().get(index); }
    onStatesChanged(handler, ctx) { return this.getStates().onChanged(handler, ctx); }
    addState(state) { return this.getStates().add(state); }
    insertStateAt(state, index) { return this.getStates().insertAt(state, index); }
    removeState(state) { return this.getStates().remove(state); }
    removeStateAt(index) { return this.getStates().removeAt(index); }

    getEntities() { return this.getMember('entities'); }
    onEntitiesChanged(handler, ctx) { return this.getMember('entities').onChanged(handler, ctx); }

    getRenderState() {
      if (this._renderState === null) {
        this._renderState = new SceneRenderState(
          this.getProject().getSettings().getAspect()
        );
        this.getEntities().forEach(entity => entity.createRenderState());
      }

      return this._renderState;
    }

    static create(project) {
      var scene = new Scene(project),
          BoxEntity = np.require('entities.BoxEntity');
      scene.addState(State.create(scene));
      scene.getEntities().add(new BoxEntity(scene));
      return scene;
    }
  }

  require('np.Serializer').register(name, Scene);

  return Scene;
});
