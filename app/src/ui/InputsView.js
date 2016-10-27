np.define('ui.InputsView', (require, name) => {
  var Element = require('ui.Element'),
      Container = require('ui.Container'),
      Editors = require('model.Editors');

  class InputEntry extends Element {
    constructor(input) {
      super('div', 'input-entry');
      this._input = input;
      this._label = new Element('span', 'input-entry-label', input.getName());
      this._editor = Editors.forInput(input);
    }

    _createElement(doc, el) {
      el.appendChild(this._label.createElement(doc));
      el.appendChild(this._editor.createElement(doc));
    }
  }

  class InputsView extends Container {
    constructor(application) {
      super('div', 'app-inputs');

      this._selection = application.getSelection().getEntityGroup();
      this._selection.onChanged(evt => this._onSelectionChanged);
    }

    _onSelectionChanged(evt) {
      this._update();
    }

    _update() {
      this._children.clear();
      this._inputs = this._selection.getInputs();
      this._inputs.forEach((input) => {
        this.add(new InputEntry(input));
      });
    }
  }

  return InputsView;
});
