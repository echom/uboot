np.define('np.Serializer', (require) => {
  class Serializer {
    static findByType(type) {
      return Serializer._entries.find(e => e.type === type);
    }
    static findByName(name) {
      return Serializer._entries.find(e => e.name === name);
    }
    static register(name, type, init) {
      var entry = Serializer.findByType(type);

      if (!entry) {
        Serializer._entries.push({ name: name, type: type });
      }
    }

    constructor() {
      this._stack = [];
      this._current = null;
    }

    _push(current) {
      this._stack.unshift(current);
      this._current = current;
      return current;
    }
    _pop() {
      var current = this._stack.shift();
      this._current = this._stack[0];
      return current;
    }

    serialize(obj) {
      var entry = Serializer.findByType(obj.constructor);
      if (entry) {
        this._push({ __type: entry.name });
        obj.serialize(this);
        return this._pop();
      }
      return undefined;
    }
    deserialize(obj) {
      var entry = Serializer.findByName(obj.__type),
          instance;
      if (entry) {
        this._push(obj);
        instance = entry.type.deserialize ?
          entry.type.deserialize(this) :
          new entry.type(); // eslint-disable-line new-cap
        instance.deserialize(this);
        this._pop();
      }
      return instance;
    }

    write(key, value) {
      this._current[key] = value;
    }

    read(key) {
      return this._current[key];
    }
  }
  Serializer._entries = [];

  return Serializer;
});
