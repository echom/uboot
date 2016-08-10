np.define('ui.StatesListView', () => {
  var Element = np.require('ui.Element'),
      List = np.require('ui.List'),
      Icon = np.require('ui.Icon');

  class StatesListItem extends List.Item {
    constructor(state, player) {
      super('li', 'app-state');

      this._state = state;

      this._indicator = this.add(new Element('div', 'round mini btn app-state-indicator'));
      this._duration = this.add(new Element('span', 'round mini btn app-state-duration'));

      this._indicator.setContent(this._state.getDuration() <= 0 ? Icon.str('mouse') : Icon.str('play_arrow'));
      this._duration.setContent(this._state.getDuration() || '');
      this._state.onDurationChanged((evt) => {
        this._indicator.setContent(evt.newValue <= 0 ? Icon.str('mouse') : Icon.str('play_arrow'));
        this._setDuration(evt.newValue);
      });

      this.toggleClass('current', player.getState() === state);
      player.onStateChanged((evt) => {
        this.toggleClass('current', evt.newValue === state);
      });
    }

    _setDuration(duration, force) {
      var content = [],
          d = (isFinite(duration) && duration > 0) ? duration : 0,
          h, m, s, ms;

      h = Math.floor(d / 360000);
      d %= 360000;
      m = Math.floor(d / 60000);
      d %= 60000;
      s = Math.floor(d / 1000);
      d %= 1000;
      ms = d;

      if (h) {
        content = [h + 'h', m + 'm', s + 's', ms + 'ms'].join(':');
      } else if (m) {
        content = [m + 'm', s + 's', ms + 'ms'].join(':');
      } else if (s) {
        content = [s + 's', ms + 'ms'].join(':');
      } else if (ms) {
        content = ms + 'ms';
      } else {
        content = '';
      }

      this._duration.setContent(content, force);
    }
  }

  class StatesListView extends List {
    constructor(states, player) {
      super('ul', List.multiSelection, 'app-states');

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

      super._modifySelection(index, type);

      if (type === 'single') {
        player.setState(state);
      }
    }
  }

  return StatesListView;
});
