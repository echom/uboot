np.define('app2.Settings', () => {
  class Settings {
    constructor() {
      this._parent = null;
      this._values = new Map();
    }

    setParent(parent) {
      this._parent = parent;
    }

    has(path, recurse) {
      if (this._values.has(path)) {
        return true;
      } else if (recurse && this._parent) {
        return this._parent.has(path, recurse);
      }
      return false;
    }

    get(path) {
      return this.has(path) ?
        this._values.get(path) :
        this.hasPath(path, true) ?
          this._parent.get(path) :
          undefined;
    }

    set(path, value) {
      this._values.set(path, value);
    }
  }

  return Settings;
});
