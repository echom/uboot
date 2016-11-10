np.define('app.Environment', (require, className) => {
  class PersistInfo {
    exists() { return false; }
    equals(other) { return false; }
  }

  class Environment {
    static get PersistInfo() { return PersistInfo; }

    persist(persistInfo, persistable) {
      throw new Error(`${className}.persist: Abstract invocation.`);
    }
    restore(persistInfo) {
      throw new Error(`${className}.restore: Abstract invocation.`);
    }

    queryPersistInfo() {
      throw new Error(`${className}.queryPersistInfo: Abstract invocation.`);
    }
    queryRestoreInfo() {
      throw new Error(`${className}.queryRestoreInfo: Abstract invocation.`);
    }
  }

  return Environment;
});
