np.define('ui.Vector3Editor', (require, name) => {
  var Element = require('ui.Element'),
      Editors = require('model.Editors');

  class Vector3Editor extends Element {
    constructor(value) {
      super('div', 'editor');

      this._value = value;
      this._value.onChanged((evt) => this.setXYZ(evt.value));

      this._pendingValueUpdate = 0;
      this._updateValue = this._updateValue.bind(this);

      this._inputs = null;
    }

    _getX() { return parseFloat(this._x.value); }
    _getY() { return parseFloat(this._y.value); }
    _getZ() { return parseFloat(this._z.value); }

    _setXYZ(x, y, z, force) {
      if (this.getElement()) {
        if (x != this._getX() || force) {
          this._x.value = x;
        }
        if (y != this._getY() || force) {
          this._y.value = y;
        }
        if (z != this._getZ() || force) {
          this._z.value = z;
        }
      }
    }

    _onInputChanged(target) {
      if (!this._pendingValueUpdate) {
        this._pendingValueUpdate = setTimeout(() => this._updateValue(), 50);
      }
    }

    _updateValue() {
      this._value.setXYZ(this._getX(), this._getY(), this._getZ());

      if (this._pendingValueUpdate) {
        this._pendingValueUpdate = 0;
      }
    }

    _createElement(doc, el) {
      ['x', 'y', 'z'].forEach((ordinate) => {
        var input = doc.createElement('input');
        input.type = 'number';
        input.className = 'editor-number';
        input.value = this._value.getValue()[ordinate];

        input.addEventListener('change', (evt) => {
          this._onInputChanged(ordinate, input, evt.target.value);
        });

        el.appendChild(input);

        this['_' + ordinate] = input;
      });
    }
  }

  Editors.register('vec3', Vector3Editor);

  return Vector3Editor;
});
