np.define('ui.RenderView', function() {
  var DomRenderable = np.require('ui.DomRenderable'),
      DomResizeWatch = np.require('ui.DomResizeWatch'),
      RenderView;

  RenderView = np.inherits(function() {
    DomRenderable.call(this, 'canvas', 'app-render');

    this._resizeWatch = null;
  }, DomRenderable);

  RenderView.prototype._render = function(doc, el) {
    this._resizeWatch = new DomResizeWatch(
      el,
      function() {
        el.width = el.offsetWidth;
        el.height = el.offsetHeight;
      }
    ).start();
  };

  return RenderView;
});
