np.define('ui.View', () => {
  var Container = np.require('ui.Container');

  class View extends Container {
    constructor(application, type, classNames) {
      super(type, classNames);
      this._application = application;
    }

    getApplication() { return this._application; }
  }

  return View;
});
