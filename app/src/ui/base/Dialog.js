np.define('ui.Dialog', () => {
  var Event = np.require('np.Event'),
      Container = np.require('ui.Container'),
      Element = np.require('ui.Element'),
      Button = np.require('ui.Button');

  class Dialog extends Container {
    constructor(buttons) {
      super('div', 'dialog-bg');

      this._closed = new Event(this);
      this._content = null;
      this._frame = this.add(new Container('div', 'dialog-frame'));
      this._contents = this._frame.add(new Element('div', 'dialog-content'));
      this._buttons = this._frame.add(new Container('div', 'dialog-buttons'));

      this._confirm = this._confirm.bind(this);
      this._cancel = this._cancel.bind(this);

      this._makeButtons(buttons);
    }

    getContent() { return this._content; }

    setContent(content, force) {
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
    }

    onClosed(handler, ctx) {
      return this._closed.on(handler, ctx);
    }

    _confirm(result) {
      this.detach();
      this._closed.raise({ confirmed: true, result: this._result });
    }
    _cancel(result) {
      this.detach();
      this._closed.raise({ confirmed: false, result: this._result });
    }

    _makeButtons(buttons) {
      if (!buttons || !buttons.length) {
        this.add(new Button(null, null, 'OK', this._confirm));
      } else {
        buttons.forEach(btn => this.add(
          new Button(null, null, btn.name, btn.confirm ? this._confirm : this._cancel)
        ));
      }
    }

    _render(doc, el) {
      Container.prototype._render.call(this, doc, el);
      this.setContent(this._content, true);
      el.addEventListener('mouseup', this._cancel);
      this._frame.getElement().addEventListener('mouseup', evt => {
        evt.stopPropagation();
        evt.preventDefault();
      });
    }

    _dispose() {
      super._dispose();
      this._closed.dispose();
    }

    static showMessage(doc, opts) {
      return new Promise((resolve, reject) => {
        var dialog = new Dialog(opts.buttons);
        dialog.setContent('<div class="dialog-message">' + opts.message + '</div>');
        dialog.onClosed(evt => {
          if (evt.confirmed) {
            resolve(evt.result);
          } else {
            reject(evt.result);
          }
        });
        doc.body.appendChild(dialog.render(doc));
      });
    }
  }

  return Dialog;
});
