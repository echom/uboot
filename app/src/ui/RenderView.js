np.define('ui.RenderView', () => {
  var View = np.require('ui.View'),
      ResizingBehavior = np.require('ui.ResizingBehavior');

  class RenderView extends View {
    constructor(application) {
      super(application, 'div', 'app-render');

      this._canvas = null;
      this._resizing = new ResizingBehavior(this, (w, h) => {
        this._canvas.width = w;
        this._canvas.height = h;
      });
    }

    _render(doc, el) {
      super._render(doc, el);

      this._canvas = doc.createElement('canvas');
      this._canvas.style.minHeight = '0';
      el.appendChild(this._canvas);

      this._resizing.enable(el);
    }
  }

  return RenderView;
});
