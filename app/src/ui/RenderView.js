np.define('ui.RenderView', () => {
  var Container = np.require('ui.Container'),
      Resizing = np.require('ui.Resizing');

  class RenderView extends Container {
    constructor(project, player) {
      super('div', 'app-render');

      this._player = player;

      this._renderer = null;
      this._resizing = new Resizing(this, (w, h) => {
        this._renderer.setSize(w, h);
      });
    }

    _render(doc, el) {
      super._render(doc, el);

      this._renderer = new THREE.WebGLRenderer();
      this._canvas = this._renderer.domElement;
      this._canvas.style.minHeight = '0';
      el.appendChild(this._canvas);

      this._resizing.enable(el);
    }

    renderState() {
      var //state = this._player.getState(),
          scene = this._player.getScene(),
          renderState = scene.getRenderState();

      this._renderer.render(renderState.scene, renderState.camera);
    }
  }

  return RenderView;
});
