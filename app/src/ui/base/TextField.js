np.define('ui.TextField', (require, name) => {
  var Element = require('ui.Element'),
      Observable = require('np.Observable');

  class FieldType {
    constructor(type, validateFn, convertFn) {
      this._type = type;
      this._validate = validateFn;
      this._convert = convertFn;
    }
    getType() { return this._type; }
    validate(v) { return this._validate(v); }
    convert(v) { return this._convert(v); }
  }

  class TextField extends Element {
    constructor(type, classNames, value) {
      super('input', classNames);
      this._fieldType = type || TextField.textType;
      this._value = new Observable(value, this);

      // this._onInput = this._onInput.bind(this);
      this._onBlur = this._onBlur.bind(this);
    }

    getValue() { return this._value.getValue(); }
    setValue(value, force) {
      this._value.setValue(value, force);

      if (this._element) {
        this._element.value = this._value.getValue();
      }
      return this;
    }
    onValueChanged(handler, ctx) { return this._value.onChanged(handler, ctx); }

    _createElement(doc, el) {
      super._createElement(doc, el);
      el.type = this._fieldType.getType();
      el.value = this._value.getValue();

      // el.addEventListener('input', this._onInput);
      el.addEventListener('blur', this._onBlur);
    }

    // _onInput(evt) {
    //   var value = evt.target.value;
    //   if (this._validate(value)) {
    //     this.setValue(value);
    //   }
    // }

    _onBlur(evt) {
      var value = evt.target.value;
      if (this._fieldType.validate(value)) {
        this.setValue(this._fieldType.convert(value));
      } else {
        evt.target.value = this.getValue();
      }
    }

    _dispose() {
      super._dispose();
      this._value.dispose();

      if (this._element) {
        // this._element.removeEventListener('input', this._onInput);
        this._element.removeEventListener('blur', this._onBlur);
      }
    }
  }

  TextField.FieldType = FieldType;
  TextField.text = new FieldType(
    'text',
    (v) => true,
    (v) => v
  );
  TextField.number = new FieldType(
    'number',
    (v) => !isNaN(parseFloat(v)) && isFinite(v),
    (v) => parseFloat(v)
  );

  return TextField;
});
