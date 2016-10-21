np.define('ui.InputsView', (require, name) => {
  var Container = require('ui.Container');

  class InputsView extends Container {
    constructor(app) {
      super('div', 'app-inputs');
    }

  }

  return InputsView;
});
