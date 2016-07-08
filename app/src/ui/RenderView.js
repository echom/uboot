np.define('ui.RenderView', function() {
  var DomRenderable = np.require('ui.DomRenderable'),
      DomResizeWatch = np.require('ui.DomResizeWatch'),
      RenderView;

  RenderView = np.inherits(function() {
    DomRenderable.call(this, 'div', 'app-render');

    this._resizeWatch = null;
  }, DomRenderable);

  RenderView.prototype._render = function(doc, el) {
    var canvas = doc.createElement('canvas');
    canvas.style.minHeight = '0';
    el.appendChild(canvas);

    this._resizeWatch = new DomResizeWatch(
      el,
      function() {
        canvas.width = el.offsetWidth;
        canvas.height = el.offsetHeight;
      }
    ).start();
  };

  return RenderView;
});
