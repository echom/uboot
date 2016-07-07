np.define('ui.Button', function() {
  var Observable = np.require('np.Observable'),
      DomRenderable = np.require('ui.DomRenderable'),
      Button;

  Button = np.inherits(function(type, classNames) {
    DomRenderable.call(this, type || 'button', classNames || 'btn');
    this._state = new Observable(Button.BUTTON_STATE_UP, this);
    this._content = null;

    this._hasListeners = false;
    this._onDown = this._onDown.bind(this);
    this._onUp = this._onUp.bind(this);
  }, DomRenderable);

  Button.BUTTON_STATE_DOWN = 'down';
  Button.BUTTON_STATE_UP = 'up';

  Button.prototype._render = function(doc, el) {
    DomRenderable.prototype._render.call(this, doc, el);
    this.setContent(this._content, true);
    this._state.setValue(Button.BUTTON_STATE_UP);
  };

  Button.prototype.getState = function() {
    return this._state.getValue();
  };
  Button.prototype.setState = function(state, force) {
    if ((this._state.getValue != state) || force) {
      this._state.setValue(state);
    }
    return this;
  };
  Button.prototype.onStateChanged = function() {
    return this._state.onChanged();
  };

  Button.prototype.getContent = function() {
    return this._content;
  };
  Button.prototype.setContent = function(content, force) {
    if ((content != this._content) || force) {
      this._content = content;

      if (this._element) {
        this._element.innerHTML = '';
        if (np.isA(this._content, Node)) {
          this._element.appendChild(this._content);
        } else if (np.isA(this._content, 'string')) {
          this._element.innerHTML = this._content;
        }
      }
    }

    return this;
  };

  Button.prototype._onDown = function(evt) {
    this.setState(Button.BUTTON_STATE_DOWN);
  };
  Button.prototype._onUp = function(evt) {
    this.setState(Button.BUTTON_STATE_UP);
  };

  Button.prototype.setEnabled = function(enabled, force) {
    var _enabled = this._enabled;

    DomRenderable.prototype.setEnabled.call(this, enabled, force);

    if (((enabled != _enabled) || force) && this._element) {
      if (enabled && !this._hasListeners) {
        this._element.addEventListener('mousedown', this._onDown);
        this._element.addEventListener('mouseup', this._onUp);
        this._hasListeners = true;
      } else if (!enabled && this._hasListeners) {
        this._element.removeEventListener('mousedown', this._onDown);
        this._element.removeEventListener('mouseup', this._onUp);
        this._hasListeners = false;
      }
    }

    return this;
  };

  return Button;
});
