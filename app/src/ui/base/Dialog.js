np.define('ui.Dialog', function() {
  var Event = np.require('np.Event'),
      Container = np.require('ui.Container'),
      Element = np.require('ui.Element'),
      Button = np.require('ui.Button'),
      Dialog;

  Dialog = np.inherits(function(buttons) {
    Container.call(this, 'div', 'dialog-bg');

    this._closed = new Event(this);
    this._content = null;
    this._frame = this.add(new Container('div', 'dialog-frame'));
    this._contents = this._frame.add(new Element('div', 'dialog-content'));
    this._buttons = this._frame.add(new Container('div', 'dialog-buttons'));

    this._confirm = this._confirm.bind(this);
    this._cancel = this._cancel.bind(this);

    this._makeButtons(buttons);
  }, Container);

  Dialog.prototype.getContent = function() {
    return this._content;
  };
  Dialog.prototype.setContent = function(content, force) {
    var element = this._contents.getElement();
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
    this._closed.raise({ confirmed: true, result: this._result });
  };
  Dialog.prototype._cancel = function(result) {
    this.detach();
    this._closed.raise({ confirmed: false, result: this._result });
  };

  Dialog.prototype._makeButtons = function(buttons) {
    if (!buttons || !buttons.length) {
      this.add(new Button(null, null, 'OK', this._confirm));
    } else {
      buttons.forEach(function(btn) {
        this.add(new Button(null, null, btn.name, btn.confirm ? this._confirm : this._cancel));
      }, this);
    }
  };

  Dialog.prototype._render = function(doc, el) {
    Container.prototype._render.call(this, doc, el);
    this.setContent(this._content, true);
    el.addEventListener('mouseup', this._cancel);
    this._frame.getElement().addEventListener('mouseup', function(evt) {
      evt.stopPropagation();
      evt.preventDefault();
    });
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
