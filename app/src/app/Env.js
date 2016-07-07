np.define('app.Env', function() {
  var abstractInvocationError = np.require('np.error').abstractInvocation,
      Env = function() {};

  Env.prototype.queryYesNo = function(message) {
    throw abstractInvocationError();
  };

  Env.prototype.queryOkCancel = function(message) {
    throw abstractInvocationError();
  };

  Env.prototype.queryPersistInfo = function() {
    throw abstractInvocationError();
  };
  Env.prototype.queryRestoreInfo = function() {
    throw abstractInvocationError();
  };
  Env.prototype.persist = function(persistInfo, toPersist) {
    throw abstractInvocationError();
  };
  Env.prototype.restore = function(persistInfo) {
    throw abstractInvocationError();
  };

  Env.prototype.setTitle = function(title) {
    throw abstractInvocationError();
  };

  return Env;
});
