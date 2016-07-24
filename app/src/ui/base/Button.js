np.define('ui.Button', () => {
  var Event = np.require('np.Event'),
      Element = np.require('ui.Element');

  class Button extends Element {
    constructor(type, classNames, content, onActivate, onActivateCtx) {
      super(type || 'button', classNames || 'btn', content);

      this._activate = new Event(this);
      this._onUp = this._onUp.bind(this);
      if (onActivate) {
        this.onActivate(onActivate, onActivateCtx);
      }
    }

    onActivate(handler, ctx) { return this._activate.on(handler, ctx); }

    _onUp(evt) {
      this._activate.raise();
      evt.stopPropagation();
    }

    _render(doc, el) {
      Element.prototype._render.call(this, doc, el);
      el.addEventListener('mouseup', this._onUp);
    }

    _dispose() {
      var el = this.getElement();
      if (el) {
        el.removeEventListener('mouseup', this._onUp);
      }
      this._activate.dispose();
      Element.prototype._dispose.call(this);
    }
  }

  return Button;
});
