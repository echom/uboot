np.define('np.Disposable', () => {
  class Disposable {
    constructor() {
      this._isDisposed = false;
    }

    isDisposed() { return this._isDisposed; }

    _dispose() {}

    dispose() {
      if (!this._isDisposed) {
        this._dispose();
        this._isDisposed = true;
      }
    }
  }

  return Disposable;
});
