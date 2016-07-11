np.define('ui.SelectionBehavior', function() {
  var Observable = np.require('np.Observable'),
      Behavior = np.require('ui.Behavior'),
      SelectionBehavior;

  SelectionBehavior = np.inherits(function() {
    Behavior.call(this);

    this._state = new Observable(SelectionBehavior.STATE_NONE, this);

    this._onUp = function(evt) {
      this.setState(
        this.getState() === SelectionBehavior.STATE_NONE ?
          SelectionBehavior.STATE_SELECTED :
          SelectionBehavior.STATE_NONE
      );
      evt.stopPropagation();
    }.bind(this);
  }, Behavior);

  SelectionBehavior.STATE_NONE = 'none';
  SelectionBehavior.STATE_SELECTED = 'selected';

  SelectionBehavior.prototype.setState = function(state, force) {
    this._state.setValue(state, force);
    return this;
  };
  SelectionBehavior.prototype.getState = function() {
    return this._state.getValue();
  };
  SelectionBehavior.prototype.onStateChanged = function() {
    return this._state.onChanged();
  };

  SelectionBehavior.prototype._enable = function(el) {
    el.addEventListener('mouseup', this._onUp);
  };
  SelectionBehavior.prototype._disable = function(el) {
    el.removeEventListener('mouseup', this._onUp);
  };

  return SelectionBehavior;
});
