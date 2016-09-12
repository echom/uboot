np.define('app.Env', () => {
  class Env {
    queryYesNo(message) { throw new Error('abstract invocation'); }

    queryOkCancel(message) { throw new Error('abstract invocation'); }

    queryPersistInfo(/* persistInfo */) { throw new Error('abstract invocation'); }

    queryRestoreInfo(/* persistInfo */) { throw new Error('abstract invocation'); }

    persist(persistInfo, toPersist) { throw new Error('abstract invocation'); }

    restore(persistInfo) { throw new Error('abstract invocation'); }

    setTitle(title) { throw new Error('abstract invocation'); }
  }

  return Env;
});
