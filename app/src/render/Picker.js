np.define('render.Picker', (require, name) => {
  var Disposable = require('np.Disposable');

  class Picker extends Disposable {
    constructor(renderer, resolution) {
      super();

      this._scene = null;
      this._renderer = renderer;
      this._resolution = resolution;

      this._pickingRenderTarget = null;
      this._pickingPixelBuffer = new Uint8Array(4);
      this._pickingMaterial = new THREE.RawShaderMaterial({
        vertexShader: [
          '#define SHADER_NAME vertMaterial',
          'precision highp float;',
          'uniform mat4 modelViewMatrix;',
          'uniform mat4 projectionMatrix;',
          'attribute vec3 position;',
          'void main()  {',
          '  vec3 vPosition = ( modelViewMatrix * vec4( position, 1.0 ) ).xyz;',
          '  gl_Position = projectionMatrix * vec4( vPosition, 1.0 );',
          '}'
        ].join('\n'),
        fragmentShader: [
          '#define SHADER_NAME fragMaterial',
          'precision highp float;',
          'uniform vec3 pickingColor;',
          'void main()  {',
          '  gl_FragColor = vec4( pickingColor, 1.0 );',
          '}'
        ].join('\n'),
        uniforms: {
          pickingColor: new THREE.Uniform(new THREE.Color())
            .onUpdate(function(object, camera) {
              this.value.setHex(object.data.pickingId || 0);
            })
        }
      });

      this.setSize(renderer.getSize(), true);
    }

    setSize(size, force) {
      var resolution = this._resolution,
          width = Math.round(size.width * resolution),
          height = Math.round(size.height * resolution);

      if (this._width !== width || this._height !== height || force) {
        this._width = width;
        this._height = height;

        if (!this._pickingRenderTarget) {
          this._pickingRenderTarget = new THREE.WebGLRenderTarget(width, height, {
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBAFormat
          });
          this._pickingRenderTarget.texture.generateMipmaps = false;
          this._pickingRenderTarget.texture.minFilter = THREE.NearestFilter;
        } else {
          this._pickingRenderTarget.setSize(width, height);
        }
      }
    }

    pick(scene, mouseX, mouseY) {
      var x = Math.round(mouseX * this._resolution),
          y = Math.round(mouseY * this._resolution),
          renderTarget = this._pickingRenderTarget,
          pixelBuffer = this._pickingPixelBuffer,
          renderScene = scene.getRenderState().getScene(),
          renderCamera = scene.getRenderState().getCamera(),
          id = -1;

      this.setSize(this._renderer.getSize());

      renderScene.overrideMaterial = this._pickingMaterial;
      this._renderer.render(renderScene, renderCamera, renderTarget);
      renderScene.overrideMaterial = null;

      this._renderer.readRenderTargetPixels(renderTarget, x, this._height - y, 1, 1, pixelBuffer);

      id = (pixelBuffer[0] << 16) | (pixelBuffer[1] << 8) | pixelBuffer[2];
      return id;
    }
  }

  return Picker;
});
