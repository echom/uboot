np.define('app.WebEnv', () => {
  var Env = np.require('app.Env'),
      Dialog = np.require('ui.Dialog');

  class WebEnv extends Env {
    constructor(window, doc) {
      super();

      this._window = window;
      this._doc = doc;
    }

    queryOkCancel(message) {
      return Dialog.showMessage(this._doc, {
        message: message,
        buttons: [{ confirm: true, name: 'OK' }, { name: 'Cancel' }]
      });
    }
    queryYesNo(message) {
      return Dialog.showMessage(this._doc, {
        message: message,
        buttons: [{ confirm: true, name: 'Yes' }, { name: 'No' }]
      });
    }

    setTitle(title) {
      this._doc.querySelector('title').innerHTML = 'uboot - ' + title;
    }
  }

  return WebEnv;
});
