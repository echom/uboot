np.define('doc.Reference', function() {
  var DocValue = np.require('doc.Value'),
      DocReference;

  DocReference = np.inherits(function(parent) {
    DocValue.call(this, parent);
  });

  DocReference.prototype.serialize = function() {
    return this.value ? this.value.id : -1;
  };
});
