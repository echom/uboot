np.define('app.Env', () => {
  class Env {
    queryYesNo(message) { throw new Error('abstract invocation'); }

    queryOkCancel(message) { throw new Error('abstract invocation'); }

    queryPersistInfo() { throw new Error('abstract invocation'); }

    queryRestoreInfo() { throw new Error('abstract invocation'); }

    persist(persistInfo, toPersist) { throw new Error('abstract invocation'); }

    restore(persistInfo) { throw new Error('abstract invocation'); }

    setTitle(title) { throw new Error('abstract invocation'); }
  }

  return Env;
});
