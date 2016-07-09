np.define('ui.ButtonBehavior', function() {
  var Observable = np.require('np.Observable'),
      Behavior = np.require('ui.Behavior'),
      ButtonBehavior;

  ButtonBehavior = np.inherits(function() {
    Behavior.call(this);

    this._state = new Observable('up', this);

    this._onDown = function(evt) {
      this.setState('down');
      evt.stopPropagation();
    }.bind(this);
    this._onUp = function(evt) {
      this.setState('up');
      evt.stopPropagation();
    }.bind(this);
  }, Behavior);

  ButtonBehavior.STATE_UP = 'up';
  ButtonBehavior.STATE_DOWN = 'down';

  ButtonBehavior.prototype.getState = function() {
    return this._state.getValue();
  };
  ButtonBehavior.prototype.setState = function(value, force) {
    this._state.setValue(value, force);
    return this;
  };
  ButtonBehavior.prototype.onStateChanged = function() {
    return this._state.onChanged();
  };

  ButtonBehavior.prototype._enable = function(el) {
    el.addEventListener('mousedown', this._onDown);
    el.addEventListener('mouseup', this._onUp);
  };
  ButtonBehavior.prototype._disable = function(el) {
    el.removeEventListener('mousedown', this._onDown);
    el.removeEventListener('mouseup', this._onUp);
  };

  return ButtonBehavior;
});
