np.define('ui.Element', () => {
  var Disposable = np.require('np.Disposable');

  class Element extends Disposable {
    constructor(type, classNames, content) {
      super();

      this._type = type || 'div';
      this._enabled = true;
      this._visible = true;
      this._element = null;
      this._content = content;
      this.setClasses(classNames);
    }

    render(doc) {
      if (!this._element) {
        this._element = doc.createElement(this._type);
        this._render(doc, this._element);
        this._syncClassNames();
      }
      this.setVisible(this._visible, true);
      this.setEnabled(this._enabled, true);
      this.setContent(this._content, true);
      return this._element;
    }

    _render(doc, element) {}

    getElement() { return this._element; }

    getContent() { return this._content; }

    setContent(content, force) {
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
    }

    isEnabled() { return this._enabled; }

    setEnabled(enabled, force) {
      if ((enabled !== this._enabled) || force) {
        this._enabled = enabled;
        this.toggleClass('disabled', !enabled);
      }
      return this;
    }

    isVisible() { return this._visible; }

    setVisible(visible, force) {
      if ((visible !== this._visible) || force) {
        this._visible = visible;
        this.toggleClass('hidden', !visible);
      }
      return this;
    }

    getClasses() { return this._classNames; }

    setClasses(classNames) {
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
    }

    toggleClass(className, enabled) {
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
    }

    _syncClassNames() {
      if (this._element) {
        this._element.className = this._classNames.join(' ');
      }
    }

    detach() {
      if (this._element && this._element.parentNode) {
        this._element.parentNode.removeChild(this._element);
      }
      return this;
    }

    _dispose() {
      this.detach();
    }
  }

  return Element;
});
