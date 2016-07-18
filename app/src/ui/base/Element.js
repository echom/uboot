np.define('ui.Element', function() {
  var Disposable = np.require('np.Disposable'),
      Element;


  Element = np.inherits(function(type, classNames, content) {
    this._type = type || 'div';
    this._enabled = true;
    this._visible = true;
    this._element = null;
    this._content = content;
    this.setClasses(classNames);
  }, Disposable);

  Element.prototype.render = function(doc) {
    if (!this._element) {
      this._element = doc.createElement(this._type);
      this._render(doc, this._element);
      this._syncClassNames();
    }
    this.setVisible(this._visible, true);
    this.setEnabled(this._enabled, true);
    this.setContent(this._content, true);
    return this._element;
  };
  Element.prototype._render = function(doc, element) {};

  Element.prototype.detach = function() {
    if (this._element && this._element.parentNode) {
      this._element.parentNode.removeChild(this._element);
    }
    return this;
  };

  Element.prototype.getElement = function() {
    return this._element;
  };

  Element.prototype.getContent = function() {
    return this._content;
  };
  Element.prototype.setContent = function(content, force) {
    if ((content != this._content) || force) {
      this._content = content;

      if (this._element && this._content) {
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

  Element.prototype.isEnabled = function() {
    return this._enabled;
  };
  Element.prototype.setEnabled = function(enabled, force) {
    if ((enabled !== this._enabled) || force) {
      this._enabled = enabled;
      this.toggleClass('disabled', !enabled);
    }
    return this;
  };

  Element.prototype.isVisible = function() {
    return this._visible;
  };
  Element.prototype.setVisible = function(visible, force) {
    if ((visible !== this._visible) || force) {
      this._visible = visible;
      this.toggleClass('hidden', !visible);
    }
    return this;
  };

  Element.prototype.getClasses = function() {
    return this._classNames;
  };
  Element.prototype.setClasses = function(classNames) {
    var classes = classNames || [];
    if (np.isA(classes, 'string')) {
      classes = classes.split(' ');
    }
    if (np.isA(classes, 'array')) {
      this._classNames = classes;
      this._syncClassNames();
    } else {
      throw new Error('Element.setClassNames: classNames must be a string or array');
    }
  };
  Element.prototype.addClass = function(className) {
    return this.toggleClass(className, true);
  };
  Element.prototype.removeClass = function(className) {
    return this.toggleClass(className, false);
  };
  Element.prototype.toggleClass = function(className, enabled) {
    var index = this._classNames.indexOf(className),
        sync = false,
        enable = enabled === undefined ? index < 0 : enabled;

    if (enable && index < 0) {
      this._classNames.push(className);
      sync = true;
    } else if (!enable && index >= 0) {
      this._classNames.splice(index, 1);
      sync = true;
    }
    if (sync) {
      this._syncClassNames();
    }

    return this;
  };
  Element.prototype._syncClassNames = function() {
    if (this._element) {
      this._element.className = this._classNames.join(' ');
    }
  };

  Element.prototype._dispose = function() {
    this.detach();
  };

  return Element;
});
