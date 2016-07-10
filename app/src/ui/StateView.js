np.define('ui.StateView', function() {
  var DomContainer = np.require('ui.DomContainer'),
      DomRenderable = np.require('ui.DomRenderable'),
      DurationLabel = np.require('ui.DurationLabel'),
      StateView;

  StateView = np.inherits(function(state) {
    DomContainer.call(this, 'li', 'app-state');

    this._state = state;

    this.append(new DomRenderable('i', 'app-state-indicator'));
    this.append(new DurationLabel(state.getDuration(), 'app-state-duration'));
  }, DomContainer);

  return StateView;
});
