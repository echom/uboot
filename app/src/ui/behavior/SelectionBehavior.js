np.define('ui.SelectionBehavior', () => {
  var Event = np.require('np.Event'),
      Behavior = np.require('ui.Behavior');

  class SelectionBehavior extends Behavior {
    constructor(owner) {
      super(owner);
      this._selected = new Event(owner || this);

      this._onUp = evt => {
        var type = evt.shiftKey ? 'range' : (evt.metaKey || evt.ctrlKey) ? 'toggle' : 'single';
        if (this._selected.length) {
          this._selected.raise({ type: type });
        }
        evt.stopPropagation();
      };
    }

    onSelected(handler, ctx) { this._selected.on(handler, ctx); }

    _enable(el) { el.addEventListener('mouseup', this._onUp); }

    _disable(el) { el.removeEventListener('mouseup', this._onUp); }
  }

  return SelectionBehavior;
});
