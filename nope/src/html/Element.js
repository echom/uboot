np.define('np.html.Element', (require) => {
  var Disposable = np.require('np.Disposable');

  class Element extends Disposable {
    constructor(type, classNames, onPrepare) {
      super();

      this._type = type || 'div';
      this._element = null;

      if (onPrepare) {
        this._onPrepare = onPrepare;
      }

      this.setClasses(classNames);
    }

    createElement(doc) {
      if (!this._element) {
        this._element = doc.createElement(this._type);
        this._prepareElement(doc, this._element);
        this._syncClassNames();
      }
      return this._element;
    }

    _prepareElement(element, doc) {
      if (this._onPrepare) {
        this._onPrepare(element, doc);
      }
    }

    getElement() { return this._element; }

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
      super._dispose();
      this.detach();
    }
  }

  return Element;
});
