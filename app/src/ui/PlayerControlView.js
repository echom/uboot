np.define('ui.PlayerControlView', function() {
  var Container = np.require('ui.Container'),
      Button = np.require('ui.Button');

  class PlayerControlView extends Container {
    constructor(player) {
      super('div', 'app-player');

      this._player = player;

      this._scenePrev = this.add(new Button());
      this._statePrev = this.add(new Button());
      this._playPause = this.add(new Button());
      this._stateNext = this.add(new Button());
      this._sceneNext = this.add(new Button());
    }
  }

  return PlayerControlView;
});
