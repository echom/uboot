describe('np.Serializer', () => {
  var Serializer,
      MockType = function() {};

  beforeEach(() => {
    Serializer = np.require('np.Serializer');
  });

  describe('.register', () => {
    it('should add an entry', () => {
      var init = function() {},
          entry;
      Serializer.register('MockType', MockType, init);
      entry = Serializer.findByName('MockType');

      expect(entry.name).toEqual('MockType');
      expect(entry.type).toEqual(MockType);
      expect(entry.init).toEqual(init);
    });
  });
  describe('.findByName', () => {
    it('should return the entry', () => {
      Serializer.register
    });
  });

  describe('.ctor', () => {
    it('creates a new Serializer instance', () => {
      expect(new Serializer()).toBeInstanceOf(Serializer);
    });
  });
});
