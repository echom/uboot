np.define('ui.Container', function() {
  var List = np.require('np.List'),
      Element = np.require('ui.Element'),
      Container;

  Container = np.inherits(function(type, classNames) {
    Element.call(this, type || 'div', classNames);
    this._children = new List();
  }, Element);


  Container.prototype.getChildren = function() {
    return this._children;
  };

  Container.prototype.add = function(child) {
    this.insertAt(child, this._children.length);
    return child;
  };
  Container.prototype.remove = function(child) {
    this.removeAt(this._children.indexOf(child));
  };

  Container.prototype.insertAt = function(child, index) {
    if (!(child instanceof Element)) {
      throw new Error('Child must be Element');
    }

    this.remove(child);
    if (index >= 0 && index <= this._children.length) {
      if (this._element) {
        if (index < this._children.length - 1) {
          this._element.insertBefore(
            child.render(this._element.ownerDocument),
            this._children.get(index).getElement()
          );
        } else {
          this._element.appendChild(
            child.render(this._element.ownerDocument)
          );
        }
      }
      this._children.insertAt(child, index);
    }
    return child;
  };

  Container.prototype.removeAt = function(index) {
    var child;

    if (index >= 0 && index < this._children.length) {
      child = this._children.removeAt(index);
    }

    return child;
  };

  Container.prototype._render = function(doc, el) {
    Element.prototype._render.call(this, doc, el);
    this._children.forEach(function(child) {
      el.appendChild(child.render(doc));
    });
  };

  Container.prototype.setEnabled = function(value, force) {
    this._children.forEach(function(child) {
      child.setEnabled(value, force);
    });

    return Element.prototype.setEnabled.call(this, value, force);
  };

  Container.prototype._dispose = function() {
    Element.prototype._dispose.call(this);
    this._children.forEach(function(child) { child.dispose(); });
  };

  return Container;
});
