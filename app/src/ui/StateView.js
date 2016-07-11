np.define('ui.StateView', function() {
  var View = np.require('ui.View'),
      DomRenderable = np.require('ui.DomRenderable'),
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

    this.append(new DomRenderable('i', 'app-state-indicator'));
    this.append(new DurationLabel(state.getDuration(), 'app-state-duration'));
  }, View);

  StateView.prototype._render = function(doc, el) {
    View.prototype._render.call(this, doc, el);
    this._selectionBehavior.enable(el);
  };

  return StateView;
});
