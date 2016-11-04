np.define('np.html.Container', (require, name) => {
  var List = np.require('np.List'),
      Element = np.require('ui.Element');

  class Container extends Element {
    constructor(type, classNames, onPrepare) {
      super(type, classNames, onPrepare);

      this._children = [];
      this._childContainer = null;
    }

    // getChildren() { return this._children; }

    hasChild(child) { return this._children.indexOf(child) >= 0; }

    addChild(child) { return this.insertChildAt(child, this._children.length); }

    removeChild(child) { return this.removeChildAt(this._children.indexOf(child)); }

    insertChildAt(child, index) {
      if (!(child instanceof Element)) {
        throw new Error('Child must be Element');
      }


      if (index >= 0 && index <= this._children.length) {
        if (this._element) {
          if (index < this._children.length - 1) {
            this._element.insertBefore(
              child.createElement(this._element.ownerDocument),
              this._children.get(index).getElement()
            );
          } else {
            this._element.appendChild(
              child.createElement(this._element.ownerDocument)
            );
          }
        }
        this._children.insertAt(child, index);
      }

      return child;
    }

    removeChildAt(index) {
      var child;

      if (index >= 0 && index < this._children.length) {
        child = this._children.removeAt(index);
        child.detach();
      }

      return child;
    }

    clear() {
      while (this._children.length) {
        this.removeAt(0);
      }
    }

    _setChildContainer(el) { this._childContainer = el; }
    _getChildContainer() { return this._childContainer; }

    _prepareElement(element, doc) {
      this._setChildContainer(element);
      super._prepareElement(element, doc);
      this._children.forEach(child => {
        this._getChildContainer().appendChild(child.createElement(doc));
      });
    }

    _dispose() {
      super._dispose();
      this._childContainer = null;
      this._children.forEach(child => child.dispose());
    }
  }

  return Container;
});
