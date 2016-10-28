np.define('ui.Vector3Editor', (require, name) => {
  var Element = require('ui.Element'),
      Editors = require('model.Editors');

  class Vector3Editor extends Element {
    constructor(input) {
      super('div', 'editor');

      this._input = input;

      this._onInputValueChanged = this._onInputValueChanged.bind(this);
      this._onHtmlValueChanged = this._onHtmlValueChanged.bind(this);
      this._onHtmlValueBlur = this._onHtmlValueBlur.bind(this);
      this._updateInputValue = this._updateInputValue.bind(this);


      this._offInputValueChanged = this._input.onValueChanged(this._onInputValueChanged);

      this._pendingInputValueUpdate = 0;
    }

    _getX() { return parseFloat(this._x.value); }
    _getY() { return parseFloat(this._y.value); }
    _getZ() { return parseFloat(this._z.value); }

    _onInputValueChanged(value) {
      this._updateHtmlValues(value);
    }

    _onHtmlValueChanged(evt) {
      if (!this._pendingInputValueUpdate) {
        this._pendingInputValueUpdate = setTimeout(() => this._updateInputValue(), 50);
      }
    }

    _onHtmlValueBlur(evt) {
      if (this._validateInputValues()) {
        this._updateInputValue();
      } else {
        this._updateHtmlValues(this._input.getValue());
      }
    }

    _updateHtmlValues(value, force) {
      if (this.getElement()) {
        if (value.x != this._getX() || force) {
          this._x.value = value.x;
        }
        if (value.y != this._getY() || force) {
          this._y.value = value.y;
        }
        if (value.z != this._getZ() || force) {
          this._z.value = value.z;
        }
      }
    }
    _updateInputValue() {
      var value = this._input.getValue(),
          ix,
          iy,
          iz;

      if (this._validateInputValues()) {
        ix = this._getX();
        iy = this._getY();
        iz = this._getZ();

        if (value.x !== ix || value.y !== iy || value.z !== iz) {
          value.x = ix;
          value.y = iy;
          value.z = iz;
          this._input.setValue(null, value, true);
        }
      }

      if (this._pendingInputValueUpdate) {
        this._pendingInputValueUpdate = 0;
      }
    }

    _validateInputValues() {
      var x = parseFloat(this._x.value),
          y = parseFloat(this._y.value),
          z = parseFloat(this._z.value);

      return (
        !isNaN(x) && isFinite(x) &&
        !isNaN(y) && isFinite(y) &&
        !isNaN(z) && isFinite(z)
      );
    }

    _createElement(doc, el) {
      ['x', 'y', 'z'].forEach((ordinate) => {
        var input = doc.createElement('input');
        input.type = 'number';
        input.className = 'editor-number';
        input.value = this._input.getValue()[ordinate];

        input.addEventListener('input', this._onHtmlValueChanged);
        input.addEventListener('blur', this._onHtmlValueBlur);

        el.appendChild(input);

        this['_' + ordinate] = input;
      });
    }

    _dispose() {
      super._dispose();

      this._offInputValueChanged();

      if (this.getElement()) {
        [this._x, this._y, this._z].forEach((input) => {
          input.removeEventListener('input', this._onHtmlValueChanged);
          input.removeEventListener('blur', this._onHtmlValueBlur);
        });
      }
    }
  }

  Editors.register('vec3', Vector3Editor);

  return Vector3Editor;
});
