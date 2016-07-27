np.define('ui.Activation', () => {
  var Behavior = np.require('ui.Behavior');

  class Activation extends Behavior {
    constructor(owner, onActivate) {
      super(owner);
      this._onActivate = onActivate;
    }

    _enable(el) {
      el.addEventListener('mouseup', this._onActivate);
    }

    _disable(el) {
      el.removeEventListener('mouseup', this._onActivate);
    }
  }

  return Activation;
});
