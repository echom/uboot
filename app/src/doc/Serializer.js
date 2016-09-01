np.define('doc.Serializer', () => {
  class Serializer {
    static register(type, cls) {
      this._types = Serializer._types || {};
      this._types[type] = cls;
    }
    static lookup(type) {
      var result = Serializer._types[type];
      if (!result) {
        throw new Error('Cannot deserialize unkown type: ' + type);
      }
      return result;
    }

    serialize(doc) {
      return JSON.stringify(doc.serialize());
    }
    deserialize(doc) {
      var parsed = JSON.parse(doc),
          type = parsed.type,
          Cls = Serializer.lookup(type);
      return Cls.deserialize(parsed);
    }
  }

  return Serializer;
});
