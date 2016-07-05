np.define('app.ElectronEnv', function() {
  var Env = np.require('app.Env'),
      ElectronEnv,
      abstractInvocationError = np.require('np.error').abstractInvocationError,
      electron = require('electron').remote;

  ElectronEnv = np.inherits(function(win) {
    this._win = win;
  }, Env);

  ElectronEnv.prototype.queryYesNo = function(message) {
    var that = this;
    return new Promise(function(resolve, reject) {
      var opts = {
        type: 'none',
        message: message,
        buttons: ['Yes', 'No'],
        defaultId: 0
      };

      electron.dialog.showMessageBox(that._win, opts, function(result) {
        if (result === 0) {
          resolve('ok');
        } else {
          reject('cancel');
        }
      });
    });
  };
  ElectronEnv.prototype.queryOkCancel = function(message) {
    var that = this;
    return new Promise(function(resolve, reject) {
      var opts = {
        type: 'none',
        message: message,
        buttons: ['Ok', 'Cancel'],
        defaultId: 0
      };

      electron.dialog.showMessageBox(that._win, opts, function(result) {
        if (result === 0) {
          resolve('ok');
        } else {
          reject('cancel');
        }
      });
    });
  };

  ElectronEnv.prototype.queryPersistInfo = function(persistInfo) {
    var that = this;
    return new Promise(function(resolve, reject) {
      var opts = {};
      if (persistInfo) {
        opts.defaultPath = persistInfo.path;
      }

      electron.dialog.showSaveDialog(that._win, opts, function(result) {
        if (result) {
          resolve({ path: result });
        } else {
          reject('cancel');
        }
      });
    });
  };
  ElectronEnv.prototype.queryRestoreInfo = function(persistInfo) {
    var that = this;
    return new Promise(function(resolve, reject) {
      var opts = { properties: ['openFile', 'createDirectory'] };
      if (persistInfo) {
        opts.defaultPath = persistInfo.path;
      }

      electron.dialog.showOpenDialog(that._win, opts, function(result) {
        if (result) {
          resolve({ path: result });
        } else {
          reject('cancel');
        }
      });
    });
  };

  ElectronEnv.prototype.persist = function(persistInfo, toPersist) {
    throw abstractInvocationError();
  };
  ElectronEnv.prototype.restore = function(persistInfo) {
    throw abstractInvocationError();
  };

  ElectronEnv.prototype.setTitle = function(title) {
    this._win.setTitle(title);
  };

  return ElectronEnv;
});
