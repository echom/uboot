np.define('np.html.Button', (require) => {
  var Activation = np.require('np.html.Activation'),
      Element = np.require('np.html.Element');

  class Button extends Element {
    constructor(type, classNames, onPrepare, onActivate) {
      super(type, classNames, onPrepare);

      this._activation = new Activation(this, onActivate);
    }

    _prepareElement(element, doc) {
      super.prepareElement(element, doc);
      this._activation.setEnabled(true);
    }

    _dispose() {
      super._dispose();
      this._activation.dispose();
    }
  }

  return Button;
});
