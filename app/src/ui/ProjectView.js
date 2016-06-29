np.define('ui.ProjectView', function() {
  var DomContainer = np.require('np.DomContainer'),
      ScenesView = np.require('ui.ScenesView'),
      ProjectView;

  ProjectView = np.inherits(function(project) {
    this.scenesView = this.append(new ScenesView(project.getScenes()));
    this.renderView = this.append(new RenderView(project));
  }, DomContainer);
});
