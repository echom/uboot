np.define('ui.Behavior', () => {
  var Disposable = np.require('np.Disposable');

  class Behavior extends Disposable {
    constructor(owner) {
      super();
      this._owner = owner;
      this._target = null;
    }

    hasTarget() { return !!this._target; }

    getTarget() { return this._target; }

    setTarget(target, force) {
      if ((target !== this._target) || force) {
        if (this._target) {
          this._disable(this._target);
          this._target = null;
        }
        if (target) {
          this._target = target;
          this._enable(target);
        }
      }
    }

    _enable(target) {}
    _disable(target) {}

    _dispose() {
      super._dispose();
      this.setEnabled(false, true);
    }
  }

  return Behavior;
});
