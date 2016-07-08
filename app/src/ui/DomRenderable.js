np.define('ui.DomRenderable', function() {
  var DomRenderable = function(type, classNames) {
    this._type = type;
    this._enabled = true;
    this._visible = true;
    this._element = null;
    this.setClasses(classNames);
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
  DomRenderable.prototype._render = function(doc, element) {};

  DomRenderable.prototype.detach = function() {
    if (this._element && this._element.parentNode) {
      this._element.parentNode.removeChild(this._element);
    }
    return this;
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
      this.toggleClass('disabled', !enabled);
    }
    return this;
  };

  DomRenderable.prototype.isVisible = function() {
    return this._visible;
  };
  DomRenderable.prototype.setVisible = function(visible, force) {
    if ((visible !== this._visible) || force) {
      this._visible = visible;
      this.toggleClass('hidden', !visible);
    }
    return this;
  };

  DomRenderable.prototype.getClasses = function() {
    return this._classNames;
  };
  DomRenderable.prototype.setClasses = function(classNames) {
    var classes = classNames || [];
    if (np.isA(classes, 'string')) {
      classes = classes.split(' ');
    }
    if (np.isA(classes, 'array')) {
      this._classNames = classes;
      this._syncClassNames();
    } else {
      throw new Error('DomRenderable.setClassNames: classNames must be a string or array');
    }
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
