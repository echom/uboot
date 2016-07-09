np.define('model.State', function() {
  var Element = np.require('doc.Element'),
      State;

  State = np.inherits(function() {
    Element.call(this);
  }, Element);

  State.new = function() {
    return new State();
  };

  return State;
});
