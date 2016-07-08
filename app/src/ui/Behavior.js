np.define('ui.Behavior', function() {
  var Behavior = function() {
    this._el = null;
  };

  Behavior.prototype.enable = function(el) {
    if (this._el) {
      this.disable();
    }
    this._el = el;
    this._enable(this._el);
  };
  Behavior.prototype.disable = function() {
    if (this._el) {
      this._disable(this._el);
      this._el = null;
    }
  };

  Behavior.prototype.isEnabled = function() {
    return !!this._el;
  };

  Behavior.prototype._enable = function(el) {};
  Behavior.prototype._disable = function(el) {};

  return Behavior;
});
