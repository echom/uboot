np.define('ui.Toggle', function() {
  var Element = np.require('ui.Element'),
      Activation = np.require('ui.Activation'),
      Event = np.require('np.Event'),
      TOGGLE_CLASS_NAME = 'toggle',
      ACTIVE_CLASS_NAME = 'active';

  class Toggle extends Element {
    static get activeClassName() { return ACTIVE_CLASS_NAME; }
    static set activeClassName(value) { return ACTIVE_CLASS_NAME = value; }
    static get toggleClassName() { return TOGGLE_CLASS_NAME; }
    static set toggleClassName(value) { return TOGGLE_CLASS_NAME = value; }

    constructor(type, classNames, content, onActiveChanged, onActiveChangedCtx) {
      super(type || 'div', classNames, content);

      this._activation = new Activation(this, (domEvt) => this.setActive(!this.isActive()));
      this._active = false;
      this._activeChanged = new Event(this);
      if (onActiveChanged) {
        this.onActiveChanged(onActiveChanged, onActiveChangedCtx);
      }
      this.toggleClass(TOGGLE_CLASS_NAME, true);
    }

    isActive() { return this._active; }

    setActive(active, force) {
      var _active = this._active;

      if ((active !== _active) || force) {
        this.toggleClass(ACTIVE_CLASS_NAME, active);
        this._active = active;

        if (active !== _active) {
          this._activeChanged.raise({ newValue: active, oldValue: _active });
        }
      }
      return this;
    }

    onActiveChanged(handler, ctx) {
      return this._activeChanged.on(handler, ctx);
    }

    setEnabled(enabled, force) {
      super.setEnabled(enabled, false);
      this._activation.setTarget(enabled ? this.getElement() : null);
    }

    _render(doc, el) {
      super._render(doc, el);
      this._activation.setTarget(el);
      this.setActive(this._active, true);
    }
  }

  return Toggle;
});
