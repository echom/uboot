np.define('np.error', function() {
  'use strict';

  var error = function(type, message) {
    var error = new Error(message);
    error.name = error.type = type;
    return error;
  };

  error.abstractInvocation = function() {
    return error('AbstractInvocationError', 'Unexpected invocation of abstract member.');
  };

  return error;
});
