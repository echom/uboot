np.define('ui.PlayerControlView', function() {
  var Container = np.require('ui.Container'),
      Button = np.require('ui.Button');

  class PlayerControlView extends Container {
    constructor(player) {
      super('div', 'app-player ui');

      this._player = player;

      this._scenePrev = this.add(new Button('div', 'scene-prev', '<i class="material-icons">fast_rewind</i>'));
      this._statePrev = this.add(new Button('div', 'state-prev', '<i class="material-icons">skip_previous</i>'));
      this._playPause = this.add(new Button('div', 'play-pause', '<i class="material-icons">play_circle_filled</i>'));
      this._stateNext = this.add(new Button('div', 'state-next', '<i class="material-icons">skip_next</i>'));
      this._sceneNext = this.add(new Button('div', 'scene-next', '<i class="material-icons">fast_forward</i>'));
    }
  }

  return PlayerControlView;
});
