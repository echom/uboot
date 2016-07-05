np.define('ui.RenderView', function() {
  var DomRenderable = np.require('ui.DomRenderable'),
      DomResizeWatch = np.require('ui.DomResizeWatch'),
      RenderView;

  RenderView = np.inherits(function() {
    DomRenderable.call(this, 'div', 'app-render');

    this._canvas = null;
    this._resizeWatch = null;

    this._resize = this._resize.bind(this);
  }, DomRenderable);

  RenderView.prototype._render = function(doc, el) {
    el.style.position = 'relative';
    this._canvas = doc.createElement('canvas');
    this._canvas.style.width = '100%';
    this._canvas.style.height = '100%';
    el.appendChild(this._canvas);

    this._resizeWatch = new DomResizeWatch(el);
    this._resizeWatch.onResize().add(this._resize);
    this._resizeWatch.start();
  };

  RenderView.prototype._resize = function(evt) {
    this._canvas.width = this._canvas.offsetWidth;
    this._canvas.height = this._canvas.offsetHeight;
  };

  return RenderView;
});
