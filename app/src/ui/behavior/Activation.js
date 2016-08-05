np.define('ui.Activation', () => {
  var Behavior = np.require('ui.Behavior');

  class Activation extends Behavior {
    constructor(owner, onActivate) {
      super(owner);
      this._onActivate = onActivate;
    }

    _enable(target) {
      target.addEventListener('mouseup', this._onActivate);
    }

    _disable(target) {
      target.removeEventListener('mouseup', this._onActivate);
    }
  }

  return Activation;
});
