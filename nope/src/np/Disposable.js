np.define('np.Disposable', () => {

  /**
   * This class represents the base class of objects which implement
   * @memberof np
   */
  class Disposable {

    /**
     * Constructs a new disposable object.
     */
    constructor() {
      this._isDisposed = false;
    }

    /**
     * This method can be used to determine whether this instance was disposed
     * of.
     * @return {boolean} a boolean value indicating whether this instance was
     *    disposed of
     */
    isDisposed() { return this._isDisposed; }

    /**
     * Overriding class should implement class specific dispose login in this
     * method. This method will only be called once and implementors need not
     * check whether this instance was already disposed of.
     * @protected
     */
    _dispose() {}

    /**
     * Disposes of this instance.
     */
    dispose() {
      if (!this._isDisposed) {
        this._dispose();
        this._isDisposed = true;
      }
    }
  }

  return Disposable;
});
