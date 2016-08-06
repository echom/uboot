np.define('ui.RenderView', () => {
  var Container = np.require('ui.Container'),
      Resizing = np.require('ui.Resizing');

  class RenderLoop {
    static get SLEEP_THRESHOLD() { return 2000; }

    constructor(owner, onRender) {
      this._owner = owner;
      this._onRender = onRender;

      this._triggerTime = 0;
      this._continuous = false;

      this._animationHandle = 0;
      this._render = this._render.bind(this);
    }

    trigger(continuous) {
      this._triggerTime = np.now();
      this._continuous = !!continuous;

      if (!this._animationHandle) {
        this._animationHandle = requestAnimationFrame(this._render);
      }
    }

    _render(ts) {
      var continuous = this._continuous,
          triggerTime = this._triggerTime,
          renderTime = continuous ? 0 : np.now() - triggerTime;

      this._onRender.call(this._owner, ts);

      if (renderTime < RenderLoop.SLEEP_THRESHOLD) {
        this._animationHandle = requestAnimationFrame(this._render);
      } else {
        this._animationHandle = 0;
      }
    }
  }

  class RenderView extends Container {
    constructor(project, player) {
      super('div', 'app-render');

      this._player = player;
      this._aspect = project.getSettings().getAspect();
      this._renderLoop = new RenderLoop(this, (dt) => this._renderCurrentState(dt));

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
        this._renderLoop.trigger();
      });

      this._player.onStateChanged(evt => this._renderCurrentState());
      this._player.onRunningChanged(evt => this._renderLoop.trigger(evt.newValue));
    }

    _render(doc, el) {
      super._render(doc, el);

      this._renderer = new THREE.WebGLRenderer({ alpha: true });
      this._renderer.setClearColor(0xffffff, 0);
      this._canvas = this._renderer.domElement;
      el.appendChild(this._canvas);

      this._resizing.setTarget(el, true);
      this._renderLoop.trigger();
    }

    _renderCurrentState(ts) {
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
