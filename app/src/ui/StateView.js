np.define('ui.StateView', function() {
  var View = np.require('ui.View'),
      Element = np.require('ui.Element'),
      SelectionBehavior = np.require('ui.SelectionBehavior'),
      DurationLabel = np.require('ui.DurationLabel'),
      StateView;

  StateView = np.inherits(function(application, state) {
    View.call(this, application, 'li', 'app-state');

    this._state = state;
    this._selectionBehavior = new SelectionBehavior();
    this._selectionBehavior.onStateChanged().add(function() {
      this.toggleClass('selected');

      this.getApplication()
        .getPlayer()
        .setState(this._state);
    }.bind(this));

    this.add(new Element('i', 'app-state-indicator'));
    this.add(new DurationLabel(state.getDuration(), 'app-state-duration'));
  }, View);

  StateView.prototype._render = function(doc, el) {
    View.prototype._render.call(this, doc, el);
    this._selectionBehavior.enable(el);
  };

  return StateView;
});
