np.define('ui.Dialog', function() {
  var Event = np.require('np.Event'),
      DomContainer = np.require('ui.DomContainer'),
      Button = np.require('ui.Button'),
      Dialog,
      DialogFrame;
  DialogFrame = np.inherits(function(buttons) {
    DomContainer.call(this, 'div', 'dialog-frame');
    this._content = null;
    this._buttons = new DomContainer('div', 'dialog-buttons');

    buttons.forEach(function(name) {
      this._buttons.append(new Button('button', name));
    }, this);
  }, DomContainer);

  DialogFrame.prototype.getContent = function() {
    return this._content;
  };
  DialogFrame.prototype.setContent = function(content, force) {
    if ((content != this._content) || force) {
      this._content = content;

      if (this._element) {
        this._element.innerHTML = '';
        if (np.isA(this._content, Node)) {
          this._element.appendChild(this._content);
        } else if (np.isA(this._content, 'string')) {
          this._element.innerHTML = this._content;
        }
      }
    }

    return this;
  };

  Dialog = np.inherits(function(buttons) {
    DomContainer.call(this, 'div', 'dialog-bg');
    this._frame = this.append(new DialogFrame(buttons));
    this._closed = new Event(this);
  }, DomContainer);

  Dialog.prototype.getFrame = function() {
    return this._frame;
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

  Dialog.prototype._render = function() {
    DomContainer.prototype._render.call(this);
  };




  Dialog.showMessage = function(doc, opts) {
    return new Promise(function(resolve, reject) {
      var dialog = new Dialog(opts.buttons);
      dialog.getFrame().setContent('<div class="dialog-message">' + opts.message + '</div>');
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
