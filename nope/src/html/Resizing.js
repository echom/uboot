np.define('np.html.Resizing', (require) => {
  var Behavior = require('np.html.Behavior'),
      LO_FREQUENCY = 200,
      HI_FREQUENCY = 30,
      THROTTLE_THRESHOLD;

  class Resizing extends Behavior {
    constructor(target, onResize) {
      super(target);
      this._onResize = onResize;

      this._check = this._check.bind(this);
      this._checkHandle = 0;
      this._width = undefined;
      this._height = undefined;
      this._frequency = LO_FREQUENCY;
      this._unchanged = 0;
      this._running = false;
    }

    _setEnabled(enabled) {
      if (enabled) {
        this._check();
      } else if (this._checkHandle) {
        clearTimeout(this._checkHandle);
      }
    }

    _check() {
      var width,
          height,
          target = this.getTargetElement();

      if (target) {
        width = target.clientWidth;
        height = target.clientHeight;

        if (width !== this._width || height !== this._height) {
          this._onResize.call(null, width, height);

          this._unchanged = 0;
          this._width = width;
          this._height = height;
          this._frequency = HI_FREQUENCY;
        } else if (this._unchanged < THROTTLE_THRESHOLD) {
          this._unchanged++;
        } else {
          this._frequency = LO_FREQUENCY;
        }

        this._checkHandle = setTimeout(this._check, this._frequency);
      }
    }
  }

  return Resizing;
});
