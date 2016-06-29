np.define('ui.DomRenderable', function() {
  var error = np.require('np.error'),
      abstractInvocationError = error.abstractInvocation;

  var DomRenderable = function(type) {
    this._type = type;
    this._enabled = true;
    this._element = null;
    this._classNames = [];
  };

  DomRenderable.prototype.render = function(doc) {
    if (!this._element) {
      this._element = doc.createElement(this._type);
      this._syncClassNames();
      this._render(doc, this._element);
    }
    this.setEnabled(this._enabled, true);
    return this._element;
  };
  DomRenderable.prototype._render = function(doc, element) {
    throw abstractInvocationError();
  };

  DomRenderable.prototype.getElement = function() {
    return this._element;
  };

  DomRenderable.prototype.isEnabled = function() {
    return this._enabled;
  };
  DomRenderable.prototype.setEnabled = function(enabled, force) {
    if ((enabled !== this._enabled) || force) {
      this._enabled = enabled;
      if (this._element) {
        this._element.classList.toggle('disabled', !enabled);
      }
    }

    return this;
  };

  DomRenderable.prototype.isVisible = function() {
    return this._visible;
  };
  DomRenderable.prototype.setVisible = function(visible, force) {
    if ((visible !== this._visible) || force) {
      this._visible = visible;
      if (this._element) {
        this._element.classList.toggle('hidden', !visible);
      }
    }

    return this;
  };

  DomRenderable.prototype.addClass = function(className) {
    return this.toggleClass(className, true);
  };
  DomRenderable.prototype.removeClass = function(className) {
    return this.toggleClass(className, false);
  };
  DomRenderable.prototype.toggleClass = function(className, enabled) {
    var index = this._classNames.indexOf(className),
        sync = false;
    if (enabled && index < 0) {
      this._classNames.push(className);
      sync = true;
    } else if (!enabled && index >= 0) {
      this._classNames.splice(index, 1);
      sync = true;
    }
    if (sync) {
      this._syncClassNames();
    }

    return this;
  };
  DomRenderable.prototype._syncClassNames = function() {
    if (this._element) {
      this._element.className = this._classNames.join(' ');
    }
  };

  return DomRenderable;
});
