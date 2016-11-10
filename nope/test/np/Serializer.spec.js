describe('np.Serializer', () => {
  var Serializer = np.require('np.Serializer'),
      MockType;

  beforeEach(() => {
    MockType = class {
      serialize() {}
      deserialize() {}
    };
  });

  describe('.register', () => {
    it('adds an entry', () => {
      var entry;

      Serializer.register('MockType', MockType);
      entry = Serializer.findByName('MockType');

      expect(entry.name).toEqual('MockType');
      expect(entry.type).toEqual(MockType);
    });
    it('throws an error when registering the same type mutliple times', () => {
      var willThrow = () => Serializer.register('MockType20', MockType);
      Serializer.register('MockType21', MockType);

      expect(willThrow).toThrowError(/already registered/);
    });
    it('throws an error when registering the same name multiple times', () => {
      var willThrow = () => Serializer.register('MockType20', MockType);
      Serializer.register('MockType20', function() { });

      expect(willThrow).toThrowError(/already registered/);
    });
  });
  describe('.findByName', () => {
    it('returns the entry with the name', () => {
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
  describe('.finByType', () => {

  });

  describe('ctor', () => {
    it('creates a new Serializer instance', () => {
      expect((new Serializer()) instanceof Serializer).toBe(true);
    });
  });

  describe('#serialize', () => {

  });
});
