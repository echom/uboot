np.define('env.WebEnv', function() {
  var BaseEnv = np.require('env.BaseEnv'),
      WebEnv;

  WebEnv = np.inherits(function(window, doc) {
    this._window = window;
    this._doc = doc;
  }, BaseEnv);

  WebEnv.prototype.setTitle = function(title) {
    this._doc.querySelector('title').innerHTML = title;
  };
  return WebEnv;
});
