np.define('ui.Dialog', function() {
  var Event = np.require('np.Event'),
      DomContainer = np.require('ui.DomContainer'),
      Button = np.require('ui.Button'),
      Dialog;

  Dialog = np.inherits(function(buttons) {
    DomContainer.call(this, 'div', 'dialog-bg');

    this._closed = new Event(this);
    this._content = null;
    this._frame = this.append(new DomContainer('div', 'dialog-frame'));
    this._buttons = this._frame.append(new DomContainer('div', 'dialog-buttons'));

    this._makeButtons(buttons);

    this._onConfirmButtonStateChanged = this._onConfirmButtonStateChanged.bind(this);
    this._onCancelButtonStateChanged = this._onCancelButtonStateChanged.bind(this);
  }, DomContainer);

  Dialog.prototype.getContent = function() {
    return this._content;
  };
  Dialog.prototype.setContent = function(content, force) {
    var element = this._frame.getElement();
    if ((content != this._content) || force) {
      this._content = content;
      if (element) {
        element.innerHTML = '';
        if (np.isA(this._content, Node)) {
          element.appendChild(this._content);
        } else if (np.isA(this._content, 'string')) {
          element.innerHTML = this._content;
        }
      }
    }

    return this;
  };

  Dialog.prototype.onClosed = function() {
    return this._closed.getInterface();
  };

  Dialog.prototype._confirm = function(result) {
    this.detach();
    this._closed.fire({ confirmed: true, result: result });
  };
  Dialog.prototype._cancel = function(result) {
    this.detach();
    this._closed.fire({ confirmed: false, result: result });
  };

  Dialog.prototype._onConfirmButtonStateChanged = function(evt) {
    if (evt.state === Button.BUTTON_STATE_UP) {
      this._confirm(this._result);
    }
  };
  Dialog.prototype._onCancelButtonStateChanged = function(evt) {
    if (evt.state === Button.BUTTON_STATE_UP) {
      this._cancel(this._result);
    }
  };
  Dialog.prototype._makeButtons = function(buttons) {
    var button;
    if (!buttons || !buttons.length) {
      button = new Button('button', 'OK');
      button.onStateChanged().add(this._onConfirmButtonStateChanged);
      this._buttons.append(button);
    } else {
      buttons.forEach(function(btn) {
        button = new Button('button', btn.name);
        button.onStateChanged().add(btn.confirm ?
          this._onConfirmButtonStateChanged :
          this._onCancelButtonStateChanged
        );
        this._buttons.append(button);
      }, this);
    }
  };

  Dialog.prototype._render = function(doc, el) {
    DomContainer.prototype._render.call(this, doc, el);
    el.addEventListener('mouseup', function(evt) { this._cancel(this._result); });
  };

  Dialog.showMessage = function(doc, opts) {
    return new Promise(function(resolve, reject) {
      var dialog = new Dialog(opts.buttons);
      dialog.setContent('<div class="dialog-message">' + opts.message + '</div>');
      dialog.onClosed().add(function(evt) {
        if (evt.confirmed) {
          resolve(evt.result);
        } else {
          reject(evt.result);
        }
      });
      doc.body.appendChild(dialog.render(doc));
    });
  };

  return Dialog;
});
