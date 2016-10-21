np.define('model.StateList', (require, name) => {
  var doc = require('np.doc'),
      DocList = doc.List,
      DocElement = doc.Element;

  class StatesList extends DocList {
    constructor() {
      super();
    }

    findState(inputId) {
      this.find((state) => state.hasInput(inputId));
    }
    findSuccessor(state, inputId) {
      
    }
  }
});
