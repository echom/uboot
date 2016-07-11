np.define('ui.View', function() {
  var DomContainer = np.require('ui.DomContainer'),
      View;

  View = np.inherits(function(application, type, classNames) {
    DomContainer.call(this, type, classNames);
    this._application = application;
  }, DomContainer);

  View.prototype.getApplication = function() {
    return this._application;
  };

  return View;
});
