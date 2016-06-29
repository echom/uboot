np.define('ui.ProjectView', function() {
  var DomContainer = np.require('ui.DomContainer'),
      // ScenesView = np.require('ui.ScenesView'),
      // RenderView = np.require('ui.RenderView'),
      ProjectView;

  ProjectView = np.inherits(function(project) {
    DomContainer.call(this, 'div');
    // this._scenesView = this.append(new ScenesView(project.getScenes()));
    // this._renderView = this.append(new RenderView(project));

    this.addClass('app-project');
  }, DomContainer);

  return ProjectView;
});
