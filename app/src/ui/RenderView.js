np.define('ui.RenderView', () => {
  var Container = np.require('ui.Container'),
      Resizing = np.require('ui.Resizing');

  class RenderView extends Container {
    constructor(project, player) {
      super('div', 'app-render');

      this._player = player;
      this._aspect = project.getSettings().getAspect();

      this._renderer = null;
      this._canvas = null;
      this._resizing = new Resizing(this, (w, h) => {
        var dpi = devicePixelRatio,
            h2 = w / this._aspect,
            th = Math.round(h2 > h ? h : h2),
            tw = Math.round(h2 > h ? h * this._aspect : w);

        this._canvas.width = tw * dpi;
        this._canvas.height = th * dpi;
        this._renderer.setSize(tw, th);
        this.renderState();
      });

      this._player.onStateChanged(evt => this.renderState());
    }

    _render(doc, el) {
      super._render(doc, el);

      this._renderer = new THREE.WebGLRenderer({ alpha: true });
      this._renderer.setClearColor(0xffffff, 0);
      this._canvas = this._renderer.domElement;
      el.appendChild(this._canvas);

      this._resizing.setTarget(el, true);
    }

    renderState() {
      var // state = this._player.getState(),
          scene = this._player.getScene(),
          renderState = scene.getRenderState();

      this._renderer.render(renderState.scene, renderState.camera);
    }

    _dispose() {
      this._resizing.dispose();
    }
  }

  return RenderView;
});
