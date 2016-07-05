np.define('ui.DomResizeWatch', function() {
  var Disposable = np.require('np.Disposable'),
      Event = np.require('np.Event'),
      DomResizeWatch;

  DomResizeWatch = np.inherits(function(element) {
    this._resize = new Event(this);
    this._element = element;

    this._check = this._check.bind(this);
    this._width = undefined;
    this._height = undefined;
    this._frequency = DomResizeWatch.LO_FREQ;
    this._unchanged = 0;
    this._running = false;
  }, Disposable);

  DomResizeWatch.LO_FREQ = 200;
  DomResizeWatch.HI_FREQ = 33;
  DomResizeWatch.THROTTLE_THRESHOLD = 30;

  DomResizeWatch.prototype.start = function() {
    this._running = true;
    this._check();
    return this;
  };
  DomResizeWatch.prototype.stop = function() {
    this._running = false;
    return this;
  };
  DomResizeWatch.prototype.onResize = function() {
    return this._resize.getInterface();
  };

  DomResizeWatch.prototype._check = function() {
    var width,
        height;

    if (this._running) {
      width = this._element.clientWidth;
      height = this._element.clientHeight;

      if (width !== this._width || height !== this._height) {
        this._onResize(width, height);

        this._unchanged = 0;
        this._width = width;
        this._height = height;
        this._frequency = DomResizeWatch.HI_FREQ;
      } else if (this._unchanged < DomResizeWatch.THROTTLE_THRESHOLD) {
        this._unchanged++;
      } else {
        this._frequency = DomResizeWatch.LO_FREQ;
      }

      this._checkHandle = setTimeout(this._check, this._frequency);
    }
  };

  DomResizeWatch.prototype._onResize = function(width, height) {
    if (this._resize.length > 0) {
      this._resize.fire({ width: width, height: height });
    }
  };

  return DomResizeWatch;
});
