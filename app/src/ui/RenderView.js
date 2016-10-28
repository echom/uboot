np.define('ui.RenderView', (require) => {
  var Container = require('ui.Container'),
      Resizing = require('ui.Resizing'),
      Activation = require('ui.Activation'),
      Picker = require('render.Picker');

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
    constructor(application) {
      super('div', 'app-render');

      this._player = application.getPlayer();
      this._project = application.getProject();
      this._aspect = this._project.getSettings().getAspect();
      this._renderLoop = new RenderLoop(this, (dt) => {
        var // state = this._player.getState(),
            scene = this._player.getScene(),
            renderState = scene.getRenderState();

        this._renderer.render(renderState.getScene(), renderState.getCamera());
      });

      this._renderer = application.getRenderer();
      this._renderer.setClearColor(0xffffff, 0);

      this._picker = new Picker(this._renderer, 0.5);

      this._resizing = new Resizing(this, (w, h) => {
        var dpi = devicePixelRatio,
            h2 = w / this._aspect,
            th = Math.round(h2 > h ? h : h2),
            tw = Math.round(h2 > h ? h * this._aspect : w);

        this._renderer.setSize(tw, th);
        this._renderer.setPixelRatio(dpi);

        this._renderLoop.trigger();
      });
      this._activation = new Activation(this, (evt) => {
        var rect = evt.target.getBoundingClientRect(),
            offsetX = evt.clientX - rect.left,
            offsetY = evt.clientY - rect.top,
            pickId = this._picker.pick(this._player.getScene(), offsetX, offsetY),
            pickTarget = pickId ? this._project.getNodeById(pickId) : null;
        if (pickTarget) {
          application.getSelection().set(pickTarget);
        }
      });

      this._player.onStateChanged(evt => this._renderLoop.trigger());
      this._player.onRunningChanged(evt => this._renderLoop.trigger(evt.value));
    }

    _createElement(doc, el) {
      super._createElement(doc, el);
      el.appendChild(this._renderer.domElement);

      this._resizing.setTarget(el, true);
      this._activation.setTarget(this._renderer.domElement, true);
      this._renderLoop.trigger();
    }

    _dispose() {
      this._picker.dispose();
      this._resizing.dispose();
      this._activation.dispose();
    }
  }

  return RenderView;
});
