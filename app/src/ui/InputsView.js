np.define('ui.InputsView', (require, name) => {
  var Element = require('ui.Element'),
      Container = require('ui.Container'),
      Button = require('ui.Button'),
      Icon = require('ui.Icon'),
      Editors = require('model.Editors');

  // TODO: Needs loading mechanism
  require('ui.Vector3Editor');

  class InputEntry extends Element {
    constructor(input) {
      super('div', 'input-entry');
      this._input = input;
      this._label = new Element('span', 'input-entry-label', input.getName());
      this._editor = Editors.forInput(input);
      this._key = new Button('span', 'mini btn input-entry-key ', Icon.str('vpn_key'));
    }

    _createElement(doc, el) {
      el.appendChild(this._label.createElement(doc));
      el.appendChild(this._editor.createElement(doc));
      el.appendChild(this._key.createElement(doc));
    }

    _dispose() {
      super._dispose();
      this._label.dispose();
      this._editor.dispose();
      this._key.dispose();
    }
  }

  class InputsView extends Container {
    constructor(application) {
      super('div', 'app-inputs');

      this._selection = application.getSelection().getEntityGroup();
      this._selection.onChanged(evt => this._onSelectionChanged(evt));
    }

    _onSelectionChanged(evt) {
      this._update();
    }

    _update() {
      this._children.forEach(child => child.dispose());

      if (!this._selection.isEmpty()) {
        this._inputs = this._selection.getInputList();
        this._inputs.forEach((input) => {
          this.add(new InputEntry(input));
        });
      }
    }
  }

  return InputsView;
});
