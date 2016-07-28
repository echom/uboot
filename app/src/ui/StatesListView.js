np.define('ui.StatesListView', () => {
  var Element = np.require('ui.Element'),
      List = np.require('ui.List'),
      DurationLabel = np.require('ui.DurationLabel');

  class StatesListItem extends List.Item {
    constructor(state, player) {
      super('li', 'app-state');

      this._state = state;

      this.add(new Element('i', 'app-state-indicator'));
      this.add(new DurationLabel(state.getDuration(), 'app-state-duration'));

      this.toggleClass('current', player.getState() === state);
      player.onStateChanged((evt) => {
        this.toggleClass('current', evt.newValue === state);
      });

      this._id = 'stateslistitem';
    }
  }

  class StatesListView extends List {
    constructor(states, player) {
      super('ul', List.MULTI_SELECT, 'app-states');

      this._states = states;
      this._player = player;

      states.forEach(state => this.add(this._createItem(state)));
      states.onChanged(evt => {
        if (evt.removed) {
          this.removeAt(evt.index);
        }
        if (evt.added) {
          this.insertAt(this._createItem(evt.added), evt.index);
        }
      });
    }

    _createItem(scene) {
      return new StatesListItem(scene, this._player);
    }

    _modifySelection(index, type) {
      var player = this._player,
          state = this._states.get(index);

      console.log('modifying state selection');

      super._modifySelection(index, type);

      if (type === 'single') {
        player.setState(state);
      }
    }
  }

  return StatesListView;
});
