np.define('app.WebEnv', function() {
  var Env = np.require('app.Env'),
      WebEnv;

  WebEnv = np.inherits(function(window, doc) {
    this._window = window;
    this._doc = doc;
  }, Env);

  WebEnv.prototype.queryOkCancel = function(message) {
    throw abstractInvocationError();
  };

  WebEnv.prototype.queryPersistInfo = function() {
    throw abstractInvocationError();
  };
  WebEnv.prototype.queryRestoreInfo = function() {
    throw abstractInvocationError();
  };
  WebEnv.prototype.persist = function(persistInfo, toPersist) {
    throw abstractInvocationError();
  };
  WebEnv.prototype.restore = function(persistInfo) {
    throw abstractInvocationError();
  };

  WebEnv.prototype.setTitle = function(title) {
    throw abstractInvocationError();
  };

  WebEnv.prototype.setTitle = function(title) {
    this._doc.querySelector('title').innerHTML = title;
  };
  return WebEnv;
});
