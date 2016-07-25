np.define('ui.StatesListView', () => {
  var Element = np.require('ui.Element'),
      ListView = np.require('ui.ListView'),
      DurationLabel = np.require('ui.DurationLabel');

  class StatesItemView extends ListView.ItemView {
    constructor(application, state) {
      super(application, state, 'li', 'app-state');

      this._state = state;

      this.add(new Element('i', 'app-state-indicator'));
      this.add(new DurationLabel(state.getDuration(), 'app-state-duration'));

      this.toggleClass('current', application.getPlayer().getState() === state);
      application.getPlayer().onStateChanged((evt) => {
        this.toggleClass('current', evt.newValue === this.getItem());
      });
    }
  }

  class StatesListView extends ListView {
    constructor(application, states) {
      super(application, states, 'multi', 'ul', 'app-states');
    }
    _createItemView(state) {
      return new StatesItemView(this.getApplication(), state);
    }

    _onItemSelected(evt, src) {
      var player = this.getApplication().getPlayer(),
          state = src.getItem();

      super._onItemSelected(evt, src);

      if (evt.type === 'single') {
        player.setState(state);
      }
    }
  }

  return StatesListView;
});
