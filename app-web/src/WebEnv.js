np.define('app.WebEnv', function() {
  var Env = np.require('app.Env'),
      Dialog = np.require('ui.Dialog'),
      WebEnv;

  WebEnv = np.inherits(function(window, doc) {
    this._window = window;
    this._doc = doc;
  }, Env);

  WebEnv.prototype.queryOkCancel = function(message) {
    return Dialog.showMessage(this._doc, {
      message: message,
      buttons: [{ confirm: true, name: 'OK' }, { name: 'Cancel' }]
    });
  };

  WebEnv.prototype.setTitle = function(title) {
    this._doc.querySelector('title').innerHTML = title;
  };
  return WebEnv;
});
