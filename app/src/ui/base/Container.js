np.define('ui.Container', () => {
  var List = np.require('np.List'),
      Element = np.require('ui.Element');

  class Container extends Element {
    constructor(type, classNames) {
      super(type || 'div', classNames);

      this._children = new List();
    }

    getChildren() { return this._children; }

    add(child) { return this.insertAt(child, this._children.length); }

    remove(child) { return this.removeAt(this._children.indexOf(child)); }

    insertAt(child, index) {
      if (!(child instanceof Element)) {
        throw new Error('Child must be Element');
      }

      this.remove(child);
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

    removeAt(index) {
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

    _createElement(doc, el) {
      super._createElement(doc, el);
      this._children.forEach(child => el.appendChild(child.createElement(doc)));
    }

    setEnabled(value, force) {
      this._children.forEach(child => child.setEnabled(value, force));

      return Element.prototype.setEnabled.call(this, value, force);
    }

    _dispose() {
      super._dispose();
      this._children.forEach(child => child.dispose());
    }
  }

  return Container;
});
