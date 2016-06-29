np.define('doc.Document', function() {
  var DocElement = np.require('doc.Element'),
      DocDocument;

  DocDocument = np.inherits(function() {
    DocElement.call(this);
  }, DocElement);

  DocDocument.prototype.getParent = function() {
    return null;
  };
  DocDocument.prototype.setParent = function(parent) {
    throw new Error('Document.setParent: Cannot set parent node of document.');
  };

  DocDocument.prototype.serialize = function() {
    return JSON.stringify(DocElement.prototype.serialize.call(this));
  };

  return DocDocument;
});
