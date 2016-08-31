np.define('ui.PlayerControls', function() {
  var Container = np.require('ui.Container'),
      Element = np.require('ui.Element'),
      Button = np.require('ui.Button'),
      Toggle = np.require('ui.Toggle'),
      Icon = np.require('ui.Icon');

  class PlayerControls extends Container {
    constructor(player) {
      super('div', 'app-player ui');

      this._player = player;

      this.add(new Element('div'));
      this._center = this.add(new Container('div', 'app-player-center'));
      this._scenePrev = this._center.add(new Button('div', 'btn', Icon.str('fast_rewind')));
      this._statePrev = this._center.add(new Button('div', 'btn', Icon.str('skip_previous')));
      this._playPause = this._center.add(new Button('div', 'btn maxi round', Icon.str('play_arrow')));
      this._loopToggle = this._center.add(new Toggle('div', 'btn', Icon.str('replay')));
      this._stateNext = this._center.add(new Button('div', 'btn', Icon.str('skip_next')));
      this._sceneNext = this._center.add(new Button('div', 'btn', Icon.str('fast_forward')));
      this._fullscreen = this.add(new Button('div', 'btn', Icon.str('fullscreen')));

      this._playPause.onActivate(() => this._togglePlayPause());
      this._loopToggle.onActiveChanged(evt => this._player.setLooping(evt.value));
      this._stateNext.onActivate(() => this._player.next());
    }

    _togglePlayPause() {
      if (!this._player.isRunning()) {
        this._player.start(this._player.getState());
        this._playPause.setContent('<i class="material-icons">pause</i>');
      } else {
        this._player.stop();
        this._playPause.setContent('<i class="material-icons">play_arrow</i>');
      }
    }
  }

  return PlayerControls;
});
