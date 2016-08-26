np.define('render.SceneRenderState', () => {
  class SceneRenderState {
    constructor(aspect) {
      this._renderScene = new THREE.Scene();
      this._pickingScene = new THREE.Scene();
      this._camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    }

    getCamera() { return this._camera; }
    getRenderScene() { return this._renderScene; }
    getPickingScene() { return this._pickingScene; }

    addRenderables(renderables) {
      renderables.forEach(renderable => {
        this._renderScene.add(renderable);
        if (renderable.data && renderable.data.pickId) {
          this._pickingScene.add(renderable);
        }
      });
    }
  }
  return SceneRenderState;
});
