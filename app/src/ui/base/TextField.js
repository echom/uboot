np.define('ui.TextField', (require, name) => {
  var Element = require('ui.Element'),
      Observable = require('np.Observable'),
      VALIDATE_ANY = () => true;

  class TextField extends Element {
    constructor(type, classNames, value, validateFn) {
      super('input', classNames);
      this._inputType = type || 'text';
      this._value = new Observable(value, this);
      this._validate = validateFn || VALIDATE_ANY;

      this._onInput = this._onInput.bind(this);
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
      el.type = this._inputType;
      el.value = this._value.getValue();

      el.addEventListener('input', this._onInput);
      el.addEventListener('blur', this._onBlur);
    }

    _onInput(evt) {
      var value = evt.target.value;
      if (this._validate(value)) {
        this.setValue(value);
      }
    }
    _onBlur(evt) {
      var value = evt.target.value;
      if (this._validate(value)) {
        this.setValue(value);
      } else {
        evt.target.value = this.getValue();
      }
    }

    _dispose() {
      super._dispose();
      this._value.dispose();

      if (this._element) {
        this._element.removeEventListener('input', this._onInput);
        this._element.removeEventListener('blur', this._onBlur);
      }
    }
  }

  return TextField;
});
