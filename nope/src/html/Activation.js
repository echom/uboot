np.define('np.html.Activation', (require) => {
  var Behavior = require('np.html.Behavior'),
      ADD_EVENT_LISTENER = 'addEventListener',
      REM_EVENT_LISTENER = 'removeEventListener';

  class Activation extends Behavior {
    constructor(target, onActivate) {
      super(target);
      this._onActivate = onActivate;
    }

    setEnabled(enabled) {
      var el = this.getTargetElement();
      el[enabled ? ADD_EVENT_LISTENER : REM_EVENT_LISTENER]('mouseup', this._onActivate);
    }
  }
  return Activation;
});
