np.define('ui.RenderView', function() {
  var DomRenderable = np.require('ui.DomRenderable'),
      RenderView;

  RenderView = np.inherits(function() {
    DomRenderable.call(this, 'canvas', 'app-gl');
  }, DomRenderable);

  return RenderView;
});
