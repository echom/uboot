np.define('render.Thumbnail', (require) => {
  var Disposable = require('np.Disposable');

  class Thumbnail extends Disposable {
    constructor(renderer) {
      super();

      this._scene = null;
      this._renderer = renderer;

      this._thumbnailRenderTarget = null;
      this._pixelBuffer = null;
    }

    setSize(width, height, force) {
      if (this._width !== width || this._height !== height || force) {
        this._width = width;
        this._height = height;

        if (!this._thumbnailRenderTarget) {
          this._thumbnailRenderTarget = new THREE.WebGLRenderTarget(width, height, {
            format: THREE.RGBAFormat
          });
          this._thumbnailRenderTarget.texture.generateMipmaps = false;
          this._thumbnailRenderTarget.texture.minFilter = THREE.NearestFilter;
        } else {
          this._thumbnailRenderTarget.setSize(width, height);
        }

        this._pixelBuffer = new Uint8Array(4 * width * height);
      }
    }

    render(scene, canvas) {
      var renderTarget,
          width = canvas.width,
          height = canvas.height,
          context = canvas.getContext('2d'),
          imageData = context.getImageData(0, 0, width, height),
          renderScene = scene.getRenderState().getScene(),
          renderCamera = scene.getRenderState().getCamera();

      this.setSize(width, height);

      renderTarget = this._thumbnailRenderTarget;
      this._renderer.render(renderScene, renderCamera, renderTarget);
      this._renderer.readRenderTargetPixels(renderTarget, 0, 0, width, height, this._pixelBuffer);

      imageData.data.set(new Uint8ClampedArray(this._pixelBuffer.buffer));
      context.putImageData(imageData, 0, 0);
    }

    _dispose() {
      this._thumbnailRenderTarget.dispose();
    }
  }

  return Thumbnail;
});
