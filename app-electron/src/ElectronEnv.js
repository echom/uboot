np.define('app.ElectronEnv', () => {
  var Env = np.require('app.Env'),
      electron = require('electron').remote;

  class ElectronEnv extends Env {
    constructor(win) {
      super();
      this._win = win;
    }

    queryYesNo(message) {
      var that = this;
      return new Promise((resolve, reject) => {
        var opts = {
          type: 'none',
          message: message,
          buttons: ['Yes', 'No'],
          defaultId: 0
        };

        electron.dialog.showMessageBox(that._win, opts, (result) => {
          if (result === 0) {
            resolve('ok');
          } else {
            reject('cancel');
          }
        });
      });
    }
    queryOkCancel(message) {
      var that = this;
      return new Promise((resolve, reject) => {
        var opts = {
          type: 'none',
          message: message,
          buttons: ['Ok', 'Cancel'],
          defaultId: 0
        };

        electron.dialog.showMessageBox(that._win, opts, (result) => {
          if (result === 0) {
            resolve('ok');
          } else {
            reject('cancel');
          }
        });
      });
    }

    queryPersistInfo(persistInfo) {
      var that = this;
      return new Promise((resolve, reject) => {
        var opts = {};
        if (persistInfo) {
          opts.defaultPath = persistInfo.path;
        }

        electron.dialog.showSaveDialog(that._win, opts, (result) => {
          if (result) {
            resolve({ path: result });
          } else {
            reject('cancel');
          }
        });
      });
    }
    queryRestoreInfo(persistInfo) {
      var that = this;
      return new Promise((resolve, reject) => {
        var opts = { properties: ['openFile', 'createDirectory'] };
        if (persistInfo) {
          opts.defaultPath = persistInfo.path;
        }

        electron.dialog.showOpenDialog(that._win, opts, (result) => {
          if (result) {
            resolve({ path: result });
          } else {
            reject('cancel');
          }
        });
      });
    }

    persist(persistInfo, toPersist) {
      throw new Error('abstract invocation');
    }
    restore(persistInfo) {
      throw new Error('abstract invocation');
    }

    setTitle(title) {
      this._win.setTitle(title);
    }
  }

  return ElectronEnv;
});
