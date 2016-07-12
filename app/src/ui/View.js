np.define('ui.View', function() {
  var Container = np.require('ui.Container'),
      View;

  View = np.inherits(function(application, type, classNames) {
    Container.call(this, type, classNames);
    this._application = application;
  }, Container);

  View.prototype.getApplication = function() {
    return this._application;
  };

  return View;
});
