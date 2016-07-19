np.define('ui.StateView', function() {
  var View = np.require('ui.View'),
      Element = np.require('ui.Element'),
      DurationLabel = np.require('ui.DurationLabel'),
      StateView;

  StateView = np.inherits(function(application, state) {
    View.call(this, application, 'li', 'app-state');

    this._state = state;

    this.add(new Element('i', 'app-state-indicator'));
    this.add(new DurationLabel(state.getDuration(), 'app-state-duration'));
  }, View);

  StateView.prototype._render = function(doc, el) {
    View.prototype._render.call(this, doc, el);
  };

  return StateView;
});
