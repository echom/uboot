np.define('env.BaseEnv', function() {
  var abstractInvocationError = np.require('np.error').abstractInvocation,
      BaseEnv = function() {}; // eslint-disable-line no-empty-function

  BaseEnv.prototype.queryOkCancel = function(message) {
    throw abstractInvocationError();
  };

  BaseEnv.prototype.queryPersistInfo = function() {
    throw abstractInvocationError();
  };
  BaseEnv.prototype.queryRestoreInfo = function() {
    throw abstractInvocationError();
  };
  BaseEnv.prototype.persist = function(persistInfo, toPersist) {
    throw abstractInvocationError();
  };
  BaseEnv.prototype.restore = function(persistInfo) {
    throw abstractInvocationError();
  };

  BaseEnv.prototype.setTitle = function(title) {
    throw abstractInvocationError();
  };

  return BaseEnv;
});
