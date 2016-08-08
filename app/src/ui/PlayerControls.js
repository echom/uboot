np.define('ui.PlayerControls', function() {
  var Container = np.require('ui.Container'),
      Button = np.require('ui.Button'),
      Toggle = np.require('ui.Toggle'),
      Icon = np.require('ui.Icon');

  class PlayerControls extends Container {
    constructor(player) {
      super('div', 'app-player ui');

      this._player = player;

      this._scenePrev = this.add(new Button('div', 'scene-prev', Icon.str('fast_rewind')));
      this._statePrev = this.add(new Button('div', 'state-prev', Icon.str('skip_previous')));
      this._playPause = this.add(new Button('div', 'play-pause', Icon.str('play_circle_filled')));
      this._loopToggle = this.add(new Toggle('div', 'play-loop', Icon.str('replay')));
      this._stateNext = this.add(new Button('div', 'state-next', Icon.str('skip_next')));
      this._sceneNext = this.add(new Button('div', 'scene-next', Icon.str('fast_forward')));

      this._playPause.onActivate(() => this._togglePlayPause());
      this._loopToggle.onActiveChanged(evt => this._player.setLooping(evt.newValue));
      this._stateNext.onActivate(() => this._player.next());
    }

    _togglePlayPause() {
      if (!this._player.isRunning()) {
        this._player.start(this._player.getState());
        this._playPause.setContent('<i class="material-icons">pause_circle_filled</i>');
      } else {
        this._player.stop();
        this._playPause.setContent('<i class="material-icons">play_circle_filled</i>');
      }
    }
  }

  return PlayerControls;
});
