np.define('model.Settings', function() {
  var Value = np.require('doc.Value'),
      Element = np.require('doc.Element'),
      ASPECT_4BY3 = 4 / 3,
      ASPECT_16BY9 = 16 / 9;

  class Settings extends Element {
    static get ASPECT_4BY3() { return ASPECT_4BY3; }
    static get ASPECT_16BY9() { return ASPECT_16BY9; }

    constructor(parent) {
      super(parent);

      this._define('aspect', new Value(this, ASPECT_16BY9));
    }

    getAspect() { return this._members.aspect.getValue(); }
    setAspect(value) {
      this._members.aspect.setValue(value);
      return this;
    }
  }

  return Settings;
});
