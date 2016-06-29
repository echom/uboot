(function(np) {
  var typeOf = np.typeOf = function(obj) {
    var str = Object.prototype.toString.call(obj);
    return str.substring(8, str.length - 1).toLowerCase();
  };

  var registry = {},
      cache = {};

  np.define = function(name, module) {
    if (registry[name]) {
      throw new Error('np.define: Module "' + name + '" is already defined.');
    }
    registry[name] = module;
  };
  np.require = function(name) {
    var module = cache[name];
    if (module) {
      return module;
    } else if (name in registry) {
      module = registry[name]();
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
   */
  np.inherits = function(ctor, base) {
    var f = function() {}; // eslint-disable-line no-empty-function
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
  np.isA = function(obj, type) {
    return ((typeof type) == 'string') ?
        typeOf(obj) === type :
        (((typeof type) == 'function') ? (obj instanceof type) : false);
  };

  np.now = Date.now ?
    function() {
      return Date.now();
    } :
    function() {
      return new Date().getTime();
    };

  np.noop = function() {}; // eslint-disable-line no-empty-function
}(this.np || (this.np = {})));
