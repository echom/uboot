np.define('ui.DurationLabel', function() {
  var Element = np.require('ui.Element'),
      DurationLabel;

  DurationLabel = np.inherits(function(duration, classNames) {
    Element.call(this, 'span', classNames);
    this.setDuration(duration);
  }, Element);

  DurationLabel.prototype.getDuration = function() {
    return this._duration;
  };
  DurationLabel.prototype.setDuration = function(duration, force) {
    var content = [],
        d = duration,
        h, m, s, ms;
    if ((this._duration !== duration) || force) {
      this._duration = duration;

      h = Math.floor(d / 360000);
      d %= 360000;
      m = Math.floor(d / 60000);
      d %= 60000;
      s = Math.floor(d / 1000);
      d %= 1000;
      ms = d;

      if (h) {
        content = [h + 'h', m + 'm', s + 's', ms + 'ms'].join(':');
      } else if (m) {
        content = [m + 'm', s + 's', ms + 'ms'].join(':');
      } else if (s) {
        content = [s + 's', ms + 'ms'].join(':');
      } else if (ms) {
        content = ms + 'ms';
      } else {
        content = 'n/a';
      }

      this.setContent(content);
    }
  };

  return DurationLabel;
});
