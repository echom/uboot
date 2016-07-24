np.define('ui.Behavior', () => {
  var Disposable = np.require('np.Disposable');

  class Behavior extends Disposable {
    constructor(owner) {
      super();
      this._element = null;
      this._owner = owner;
    }

    isEnabled() { return !!this._element; }

    enable(el) {
      if (this._element) {
        this.disable();
      }
      this._element = el;
      this._enable(this._element);
    }

    disable() {
      if (this._element) {
        this._disable(this._element);
        this._element = null;
      }
    }

    _enable(el) {}
    _disable(el) {}

    _dispose() {
      super._dispose();
      this.disable();
    }
  }

  return Behavior;
});
