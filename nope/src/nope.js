(np => {
  var typeOf = np.typeOf = obj => {
    var str = Object.prototype.toString.call(obj);
    return str.substring(8, str.length - 1).toLowerCase();
  };

  var registry = {},
      cache = {};

  /**
   * Defines a module with the given name.
   * @param {string} name - the unique name of the module
   * @param {function()} module - the module definition function
   * @throws {Error} throws an error if a module with the same name is already
   *    defined
   */
  np.define = (name, module) => {
    if (registry[name]) {
      throw new Error('np.define: Module "' + name + '" is already defined.');
    }
    registry[name] = module;
  };

  /**
   * Requires a module previously registered with the given name.
   * @param {string} name - the unique name of the module
   * @return {*} the evaluated module
   */
  np.require = (name) => {
    var module = cache[name];
    if (module) {
      return module;
    } else if (name in registry) {
      module = registry[name](name);
      if (module === undefined) {
        throw new Error('np.require: Module "' + name + '" did not return anything.');
      }
      return (cache[name] = module);
    }
    throw new Error('np.require: Module "' + name + '" not found.');
  };

  /**
   * Establishes prototypical inheritance between two constructor functions.
   * @method np.inherits
   * @param {function} ctor - the constructor function
   * @param {function} base - the base class constructor function
   * @return {function} the constructor function now inheriting from the base
   *  constructor
   * @private
   * @deprecated
   */
  np.inherits = (ctor, base) => {
    var f = function() {};
    f.prototype = base.prototype;
    ctor.prototype = new f(); // eslint-disable-line new-cap
    ctor.prototype.constructor = ctor;
    return ctor;
  };

  /**
   * Checks whether the object passed as first argument is either of the type
   * (if type is a string) or an instance of the type (if type is a function).
   * @method np.isA
   * @param {*} obj - the object to be checked
   * @param {string|function} type - the type string or constructor function to
   *  check against
   * @return {boolean} true if the type check passes, false otherwise.
   * @private
   */
  np.isA = (obj, type) => {
    return ((typeof type) == 'string') ?
        typeOf(obj) === type :
        (((typeof type) == 'function') ? (obj instanceof type) : false);
  };

  np.now = Date.now ? () => Date.now() : () => new Date().getTime();

  np.noop = () => {};
})(this.np || (this.np = {}));
