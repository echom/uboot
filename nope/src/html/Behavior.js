np.define('np.html.Behavior', (require) => {
  let Disposable = require('np.Disposable');

  class Behavior extends Disposable {
    constructor(target) {
      super();
      this._target = target;
      this._enabled = false;
    }

    getTarget() { return this._target; }
    getTargetElement() { return this._target.getElement(); }

    isEnabled() { return this._enabled; }
    setEnabled(enabled) {
      if (enabled !== this._enabled) {
        this._setEnabled(enabled);
        this._enabled = enabled;
      }
    }

    _dispose() {
      this.setEnabled(false);
      super._dispose();
    }
  }

  return Behavior;
});
