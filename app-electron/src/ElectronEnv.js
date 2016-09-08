np.define('app.ElectronEnv', () => {
  var Env = np.require('app.Env'),
      electron = require('electron').remote,
      fs = electron.require('fs');

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
        var opts = {
          filters: [
            { name: 'Uboot Project', extensions: ['ubt'] }
          ]
        };
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
        var opts = {
          properties: ['openFile', 'createDirectory'],
          filters: [
            { name: 'Uboot Project', extensions: ['ubt'] }
          ]
        };
        if (persistInfo) {
          opts.defaultPath = persistInfo.path;
        }

        electron.dialog.showOpenDialog(that._win, opts, (result) => {
          if (result) {
            resolve({ path: result[0] });
          } else {
            reject('cancel');
          }
        });
      });
    }

    persist(persistInfo, toPersist) {
      return new Promise((resolve, reject) => {
        fs.writeFile(
          persistInfo.path,
          JSON.stringify(toPersist),
          (err) => err ? reject(err) : resolve()
        );
      });
    }

    restore(persistInfo) {
      return new Promise((resolve, reject) => {
        fs.readFile(
          persistInfo.path,
          (err, data) => err ? reject(err) : resolve(JSON.parse(data))
        );
      });
    }

    setTitle(title) {
      this._win.setTitle(title);
    }
  }

  return ElectronEnv;
});
