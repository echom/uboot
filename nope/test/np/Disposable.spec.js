describe('np.Disposable', () => {
  var Disposable = np.require('np.Disposable'),
      disposable;

  beforeEach(() => {
    disposable = new Disposable();
  });

  describe('ctor', () => {
    it('creates an instance of np.Disposable', () => {
      expect(disposable instanceof Disposable).toBe(true);
    });
  });
  describe('#isDisposed', () => {
    it('returns false before calling dispose', () => {
      expect(disposable.isDisposed()).toBe(false);
    });
    it('returns true after calling dispose', () => {
      disposable.dispose();
      expect(disposable.isDisposed()).toBe(true);
    });
  });
  describe('#dispose', () => {
    beforeEach(() => {
      spyOn(disposable, '_dispose');
    });
    it('call the protected _dispose method', () => {
      disposable.dispose();
      expect(disposable._dispose).toHaveBeenCalled();
    });
    it('call the protected _dispose method once', () => {
      disposable.dispose();
      disposable.dispose();
      expect(disposable._dispose).toHaveBeenCalledTimes(1);
    });
  });
});
