np.define('ui.Toggle', function() {
  var Element = np.require('ui.Element'),
      Activation = np.require('ui.Activation'),
      Event = np.require('np.Event');

  class Toggle extends Element {
    constructor(type, classNames) {
      super(type || 'span', classNames);

      this._activeChanged = new Event(this);
      this._activation = new Activation((domEvt) => {
        this.setActive(!this.isActive());
      });
    }

    isActive() { return this._active; }

    setActive(active, force) {
      var _active = this._active;

      if ((active !== _active) || force) {
        this.toggleClass('active', active);
        this._active = active;

        if (active !== _active) {
          this._activeChanged.raise({ newValue: active, oldValue: _active });
        }
      }
      return this;
    }

    _render(doc, el) {
      super._render(doc, el);

      this.setActive(this._active, true);
    }
  }

  return Toggle;
});
