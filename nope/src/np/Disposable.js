np.define('np.Disposable', function() {
  'use strict';

  var Disposable = function() {
    this._isDisposed = false;
  };

  Disposable.prototype.isDisposed = function() {
    return this._isDisposed;
  };

  Disposable.prototype._dispose = function() {};

  Disposable.prototype.dispose = function() {
    if (!this._isDisposed) {
      this._dispose();
      this._isDisposed = true;
    }
  };

  return Disposable;
});
