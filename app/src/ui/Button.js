np.define('ui.Button', function() {
  var ButtonBehavior = np.require('ui.ButtonBehavior'),
      DomRenderable = np.require('ui.DomRenderable'),
      Button;

  Button = np.inherits(function(type, classNames) {
    DomRenderable.call(this, type || 'button', classNames || 'btn');
    this._buttonBehavior = new ButtonBehavior();
  }, DomRenderable);

  Button.STATE_UP = ButtonBehavior.STATE_UP;
  Button.STATE_DOWN = ButtonBehavior.STATE_DOWN;

  Button.prototype._render = function(doc, el) {
    DomRenderable.prototype._render.call(this, doc, el);
    this.setContent(this._content, true);
    this.setState(Button.STATE_UP);
  };

  Button.prototype.getState = function() {
    return this._buttonBehavior.getState();
  };
  Button.prototype.setState = function(state, force) {
    this._buttonBehavior.setState(state, force);
    return this;
  };
  Button.prototype.onStateChanged = function() {
    return this._buttonBehavior.onStateChanged();
  };

  Button.prototype.setEnabled = function(enabled, force) {
    if (((enabled != this.isEnabled()) || force) && this._element) {
      if (enabled) {
        this._buttonBehavior.enable(this._element);
      } else {
        this._buttonBehavior.disable();
      }
    }
    DomRenderable.prototype.setEnabled.call(this, enabled, force);
    return this;
  };

  return Button;
});
