np.define('ui.Button', () => {
  var Event = np.require('np.Event'),
      Element = np.require('ui.Element'),
      Activation = np.require('ui.Activation');

  class Button extends Element {
    constructor(type, classNames, content, onActivate, onActivateCtx) {
      super(type || 'button', classNames || 'btn', content);

      this._activate = new Event(this);
      if (onActivate) {
        this.onActivate(onActivate, onActivateCtx);
      }

      this._activation = new Activation(this, (domEvt) => {
        this._activate.raise();
        domEvt.stopPropagation();
      });
    }

    onActivate(handler, ctx) { return this._activate.on(handler, ctx); }

    _render(doc, el) {
      Element.prototype._render.call(this, doc, el);
      this._activation.enable(el);
    }

    setEnabled(enabled, force) {
      super.setEnabled(enabled, force);

      if (this._element) {
        if (enabled) {
          this._activation.enable(this._element);
        } else {
          this._activation.disable();
        }
      }
    }

    _dispose() {
      var el = this.getElement();
      if (el) {
        el.removeEventListener('mouseup', this._onUp);
      }
      this._activate.dispose();
      this._activation.dispose();
      Element.prototype._dispose.call(this);
    }
  }

  return Button;
});
