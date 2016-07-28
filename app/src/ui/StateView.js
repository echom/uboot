np.define('ui.StateView', () => {
  var Container = np.require('ui.Container'),
      Element = np.require('ui.Element'),
      DurationLabel = np.require('ui.DurationLabel');

  class StateView extends Container {
    constructor(state) {
      super('li', 'app-state');

      this._state = state;

      this.add(new Element('i', 'app-state-indicator'));
      this.add(new DurationLabel(state.getDuration(), 'app-state-duration'));
    }
  }

  return StateView;
});
