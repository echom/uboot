np.define('ui.DomContainer', function() {
  'use strict';

  var DomRenderable = np.require('ui.DomRenderable');

  var DomContainer = np.inherits(function(type) {
    DomRenderable.call(this, type || 'div');
    this._children = [];
  }, DomRenderable);

  DomContainer.prototype.getChildren = function() {
    return this._children;
  };

  DomContainer.prototype.append = function(child) {
    this._removeAt(this._children.indexOf(child));
    this._children.push(child);
    if (this._element) {
      this._element.appendChild(child.render(this._element.ownerDocument));
    }
    return child;
  };

  DomContainer.prototype.remove = function(child) {
    this._removeAt(this._children.indexOf(child));
  };

  DomContainer.prototype._removeAt = function(index) {
    var child,
        childElement;

    if (index >= 0 && index < this.children.length) {
      child = this._children[index];
      this._children.splice(index, 1);

      childElement = child.getElement();
      if (childElement && childElement.parentNode) {
        childElement.parentNode.removeChild(childElement);
      }
    }

    return child;
  };

  DomContainer.prototype._render = function(doc, el) {
    this._children.forEach(function(child) {
      el.appendChild(child.render(doc));
    });
  };

  DomContainer.prototype.setEnabled = function(value, force) {
    var i = this._children.length;

    while (i--) {
      this._children[i].setEnabled(value, force);
    }

    return DomRenderable.prototype.setEnabled.call(this, value, force);
  };

  return DomContainer;
});
