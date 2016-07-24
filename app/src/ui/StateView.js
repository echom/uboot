np.define('ui.StateView', () => {
  var View = np.require('ui.View'),
      Element = np.require('ui.Element'),
      DurationLabel = np.require('ui.DurationLabel');

  class StateView extends View {
    constructor(application, state) {
      super(application, 'li', 'app-state');

      this._state = state;

      this.add(new Element('i', 'app-state-indicator'));
      this.add(new DurationLabel(state.getDuration(), 'app-state-duration'));
    }
  }

  return StateView;
});
