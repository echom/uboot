describe('np.Serializer', () => {
  var Serializer = np.require('np.Serializer'),
      MockType;

  beforeEach(() => {
    MockType = function() {};
  });

  describe('.register', () => {
    it('should add an entry', () => {
      var entry;

      Serializer.register('MockType', MockType);
      entry = Serializer.findByName('MockType');

      expect(entry.name).toEqual('MockType');
      expect(entry.type).toEqual(MockType);
    });
    it('should throw an error when registering the same type mutliple times', () => {
      var willThrow = () => Serializer.register('MockType2', MockType);
      Serializer.register('MockType2', MockType);

      expect(willThrow).toThrowError(/already registered/);
    });
  });
  describe('.findByName', () => {
    it('should return the entry with the name', () => {
      var entry;

      Serializer.register('MockType3', MockType);
      entry = Serializer.findByName('MockType3');

      expect(entry.name).toEqual('MockType3');
      expect(entry.type).toEqual(MockType);
    });
    it('should return undefined if the name is not registered', () => {
      var entry = Serializer.findByName('[Non-Existent]]');

      expect(entry).toBeUndefined();
    });
  });

  describe('ctor', () => {
    it('creates a new Serializer instance', () => {
      expect((new Serializer()) instanceof Serializer).toBe(true);
    });
  });
});
