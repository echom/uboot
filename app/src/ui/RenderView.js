np.define('ui.RenderView', () => {
  var Container = np.require('ui.Container'),
      Resizing = np.require('ui.Resizing'),
      Disposable = np.require('np.Disposable');

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

  class Picking extends Disposable {
    constructor(renderer, resolution) {
      super();

      this._renderer = renderer;
      this._resolution = resolution;

      this._pickingRenderTarget = null;
      this._pickingPixelBuffer = new Uint8Array(4);

      this.setSize(renderer.getSize(), true);

      this._pickingMaterial = new THREE.RawShaderMaterial({
        vertexShader: [
          '#define SHADER_NAME vertMaterial',
          'precision highp float;',
          'uniform mat4 modelViewMatrix;',
          'uniform mat4 projectionMatrix;',
          'attribute vec3 position;',
          'varying vec3 vPosition;',
          'void main()  {',
          '  vPosition = ( modelViewMatrix * vec4( position, 1.0 ) ).xyz;',
          '  gl_Position = projectionMatrix * vec4( vPosition, 1.0 );',
          '}'
        ].join('\n'),
        fragmentShader: [
          '#define SHADER_NAME fragMaterial',
          'precision highp float;',
          'uniform vec3 pickingColor;',
          'varying vec3 vPosition;',
          'void main()  {',
          '  gl_FragColor = vec4( pickingColor, 1.0 );',
          '}'
        ].join('\n'),
        uniforms: {
          pickingColor: new THREE.Uniform(new THREE.Color())
            .onUpdate(function(object, camera) {
              this.value.setHex((object.data && object.data.pickingId) || 0);
            })
        }
      });
    }

    setSize(size, force) {
      var resolution = this._resolution,
          width = Math.round(size.width * resolution),
          height = Math.round(size.height * resolution);

      if (this._width !== width || this._height !== height || force) {
        this._width = width;
        this._height = height;

        if (!this._pickingRenderTarget) {
          this._pickingRenderTarget = new THREE.WebGLRenderTarget(width, height);
          this._pickingRenderTarget.texture.generateMipmaps = false;
          this._pickingRenderTarget.texture.minFilter = THREE.NearestFilter;
        } else {
          this._pickingRenderTarget.setSize(width, height);
        }
      }
    }

    pick(mouseX, mouseY, scene, camera) {
      var x = Math.round(mouseX * this._resolution),
          y = Math.round(mouseY * this._resolution),
          rt = this._pickingRenderTarget,
          pb = this._pickingPixelBuffer,
          id = -1;

      this.setSize(this._renderer.getSize());

      scene.overrideMaterial = this._pickingMaterial;
      this._renderer.render(scene, camera, this._pickingRenderTarget);
      scene.overrideMaterial = null;

      this._renderer.readRenderTargetPixels(rt, x, this._height - y, 1, 1, pb);

      id = (pb[0] << 16) | (pb[1] << 8) | pb[2];

      return this._pickables[id];
    }
  }

  class RenderView extends Container {
    constructor(project, player) {
      super('div', 'app-render');

      this._player = player;
      this._aspect = project.getSettings().getAspect();
      this._renderLoop = new RenderLoop(this, (dt) => {
        var // state = this._player.getState(),
            scene = this._player.getScene(),
            renderState = scene.getRenderState();

        this._renderer.render(renderState.getRenderScene(), renderState.getCamera());
      });

      this._renderer = null;
      this._canvas = null;
      this._resizing = new Resizing(this, (w, h) => {
        var dpi = devicePixelRatio,
            h2 = w / this._aspect,
            th = Math.round(h2 > h ? h : h2),
            tw = Math.round(h2 > h ? h * this._aspect : w);

        this._renderer.setSize(tw, th);
        this._renderer.setPixelRatio(dpi);
        // this._canvas.width = tw * dpi;
        // this._canvas.height = th * dpi;

        this._renderLoop.trigger();
      });

      this._player.onStateChanged(evt => this._renderLoop.trigger());
      this._player.onRunningChanged(evt => this._renderLoop.trigger(evt.newValue));
    }

    _createElement(doc, el) {
      super._createElement(doc, el);

      this._renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      this._renderer.setClearColor(0xffffff, 0);
      this._canvas = this._renderer.domElement;
      el.appendChild(this._canvas);

      this._resizing.setTarget(el, true);
      this._renderLoop.trigger();
    }

    _dispose() {
      this._resizing.dispose();
    }
  }

  return RenderView;
});
