np.define('ui.Resizing', () => {
  var Behavior = np.require('ui.Behavior');

  class Resizing extends Behavior {
    static get LO_FREQ() { return 200; }
    static get HI_FREQ() { return 33; }
    static get THROTTLE_THRESHOLD() { return 30; }

    constructor(owner, onResize) {
      super(owner);
      this._onResize = onResize;

      this._check = this._check.bind(this);
      this._checkHandle = 0;
      this._width = undefined;
      this._height = undefined;
      this._frequency = Resizing.LO_FREQ;
      this._unchanged = 0;
      this._running = false;
    }

    _enable(el) {
      this._check();
    }

    _disable(el) {
      super._disable();
      if (this._checkHandle) {
        clearTimeout(this._checkHandle);
      }
    }

    _check() {
      var width,
          height,
          target = this.getTarget();

      if (target) {
        width = target.clientWidth;
        height = target.clientHeight;

        if (width !== this._width || height !== this._height) {
          this._onResize.call(null, width, height);

          this._unchanged = 0;
          this._width = width;
          this._height = height;
          this._frequency = Resizing.HI_FREQ;
        } else if (this._unchanged < Resizing.THROTTLE_THRESHOLD) {
          this._unchanged++;
        } else {
          this._frequency = Resizing.LO_FREQ;
        }

        this._checkHandle = setTimeout(this._check, this._frequency);
      }
    }
  }

  return Resizing;
});
