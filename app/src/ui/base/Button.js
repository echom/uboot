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

    _createElement(doc, el) {
      super._createElement(doc, el);
      this._activation.setTarget(el);
    }

    setEnabled(enabled, force) {
      super.setEnabled(enabled, force);
      this._activation.setTarget(enabled ? this.getElement() : null);
    }

    _dispose() {
      super._dispose();
      this._activate.dispose();
      this._activation.dispose();
      Element.prototype._dispose.call(this);
    }
  }

  return Button;
});
