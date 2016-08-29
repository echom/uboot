np.define('render.SceneRenderState', () => {
  class SceneRenderState {
    constructor(aspect) {
      this._scene = new THREE.Scene();
      this._camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    }

    getCamera() { return this._camera; }
    getScene() { return this._scene; }

    add(renderables) {
      renderables.forEach(renderable => {
        this._scene.add(renderable);
      });
    }
  }
  return SceneRenderState;
});
