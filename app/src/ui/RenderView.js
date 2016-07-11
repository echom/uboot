np.define('ui.RenderView', function() {
  var View = np.require('ui.View'),
      DomResizeWatch = np.require('ui.DomResizeWatch'),
      RenderView;

  RenderView = np.inherits(function(application) {
    View.call(this, application, 'div', 'app-render');

    this._resizeWatch = null;
  }, View);

  RenderView.prototype._render = function(doc, el) {
    var canvas = doc.createElement('canvas');

    View.prototype._render.call(this, doc, el);

    canvas.style.minHeight = '0';
    el.appendChild(canvas);

    this._resizeWatch = new DomResizeWatch(
      el,
      function() {
        canvas.width = el.clientWidth;
        canvas.height = el.clientHeight;
      }
    ).start();
  };

  return RenderView;
});
