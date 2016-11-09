np.define('np.Serializer', (require, className) => {

  /**
   * @interface np.ISerializable
   */
  /**
   * Implementing classes should implement class specific serialization logic
   * in this method.
   * @method np.ISerializable#serialize
   * @param {np.Serializer} serializer - the serializer instance
   */
  /**
   * Implementing classes should implement class specific deserialization logic
   * in this method.
   * @method np.ISerializable#deserialize
   * @param {np.Serializer} serializer - the serializer instance
   */
  /**
   * Implementing classes may choose to implement a static deserializer method
   * in order to provide custom instantiation logic. If this method is not
   * present it will be ignored and the default empty constructor will be called.
   * @method np.ISerializable.deserialize
   * @param {np.Serializer} serializer - the serializer instance
   * @returns {np.ISerializable} an instance of a serializable type
   */

  /**
   * The Serializer allows to transform object trees to serializable form.
   * @memberof np
   */
  class Serializer {
    static findByType(type) {
      return Serializer._entries.find(e => e.type === type);
    }
    static findByName(name) {
      return Serializer._entries.find(e => e.name === name);
    }

    /**
     * Registers a serializable type.
     * @param {string} name - the full name path of the serializable type to
     *    register
     * @param {function} type - the constructor function to register
     */
    static register(name, type) {
      var entry = Serializer.findByType(type);

      if (!entry) {
        Serializer._entries.push({ name: name, type: type });
      } else {
        throw new Error(
          className + '.register: Type "' + name + '" was already registered.'
        );
      }
    }

    /**
     * Constructs a new Serializer instance.
     */
    constructor() {
      this._stack = [];
      this._current = null;
    }

    /**
     * Pushes the current de-/serialization target on the stack.
     * @param {object} current - the current de-/serialization target
     * @return {object} the current de-/serialization target
     * @private
     */
    _push(current) {
      this._stack.unshift(current);
      this._current = current;
      return current;
    }

    /**
     * Removes the current de-/serialization target from the stack and sets the
     * next element to the current target.
     * @return {object} the current de-/serialization target
     * @private
     */
    _pop() {
      var current = this._stack.shift();
      this._current = this._stack[0];
      return current;
    }

    /**
     * Serializes an object graph recursively. Objects to serialize must have
     * their type registered through {@link np.Serializer.register}.
     * @param {np.ISerializable} obj - the object to serialize
     * @return {object} the serialization result
     */
    serialize(obj) {
      var entry = Serializer.findByType(obj.constructor);
      if (entry) {
        this._push({ __type: entry.name });
        obj.serialize(this);
        return this._pop();
      } else {
        throw new Error(
          name + '.serialize: Could not find type entry for the current serialization target.'
        );
      }
    }

    /**
     * Deserializes an object graph recursively. Objects to deserialize must have
     * their type registered through {@link np.Serializer.register}.
     * @param {object} obj - the object to serialize
     * @return {np.ISerializable} the deserialized object
     */
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
      } else {
        throw new Error(
          name + '.deserialize: Could not find type entry for the current deserialization target.'
        );
      }
      return instance;
    }

    /**
     * Writes a raw value to the current serialization target.
     * @param {string} key - the key for which to save a raw value
     * @param {*} value - the value to write
     */
    write(key, value) {
      this._current[key] = value;
    }

    /**
     * Reads a raw value from the current deserialization target.
     * @param {string} key - the key for which to read a raw value
     * @return {*} the value
     */
    read(key) {
      return this._current[key];
    }
  }

  /**
   * A list of registered type entries for serialization.
   * @private
   */
  Serializer._entries = [];

  return Serializer;
});
