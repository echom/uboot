np.define('ui.Button', function() {
  var Event = np.require('np.Event'),
      Element = np.require('ui.Element'),
      Button;

  Button = np.inherits(function(type, classNames, content, onActivate) {
    Element.call(this, type || 'button', classNames || 'btn');

    this._activate = new Event(this);
    this._onUp = this._onUp.bind(this);

    this.setContent(content);
    if (onActivate) {
      this.onActivate(onActivate);
    }
  }, Element);

  Button.prototype.onActivate = function(handler, ctx) {
    return this._activate.on(handler, ctx);
  };

  Button.prototype._onUp = function(evt) {
    this._activate.raise();
    evt.stopPropagation();
  };

  Button.prototype._render = function(doc, el) {
    Element.prototype._render.call(this, doc, el);
    el.addEventListener('mouseup', this._onUp);
  };

  Button.prototype._dispose = function() {
    var el = this.getElement();
    if (el) {
      el.removeEventListener('mouseup', this._onUp);
    }
    this._activate.dispose();
    Element.prototype._dispose.call(this);
  };

  return Button;
});
