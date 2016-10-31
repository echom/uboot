np.define('ui.Vector3Editor', (require, name) => {
  var Element = require('ui.Element'),
      TextField = require('ui.TextField'),
      Editors = require('model.Editors');

  function validateNumber(v) { return !isNaN(parseFloat(v)) && isFinite(v); }

  class Vector3Editor extends Element {
    constructor(input) {
      super('div', 'editor');

      this._input = input;
      this._x = new TextField('number', 'editor-number', input.getValue().x, validateNumber);
      this._y = new TextField('number', 'editor-number', input.getValue().y, validateNumber);
      this._z = new TextField('number', 'editor-number', input.getValue().z, validateNumber);

      this._x.onValueChanged((evt) => this._propagateToInput('x', evt.value));
      this._y.onValueChanged((evt) => this._propagateToInput('y', evt.value));
      this._z.onValueChanged((evt) => this._propagateToInput('z', evt.value));

      this._offInputValueChanged = this._input.onValueChanged((evt) => {
        this._x.setValue(evt.value.x);
        this._y.setValue(evt.value.y);
        this._z.setValue(evt.value.z);
      });

      this._pendingInputValueUpdate = 0;
    }

    _propagateToInput(ordinate, value) {
      var v = this._input.getValue();
      v[ordinate] = value;
      this._input.setValue(null, value, true);
    }

    _createElement(doc, el) {
      el.appendChild(this._x.createElement(doc));
      el.appendChild(this._y.createElement(doc));
      el.appendChild(this._z.createElement(doc));
    }

    _dispose() {
      super._dispose();

      this._x.dispose();
      this._y.dispose();
      this._z.dispose();

      this._offInputValueChanged();
    }
  }

  Editors.register('vec3', Vector3Editor);

  return Vector3Editor;
});
