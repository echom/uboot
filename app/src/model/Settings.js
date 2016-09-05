np.define('model.Settings', function(require, name) {
  var DocValue = require('np.DocValue'),
      DocElement = require('np.DocElement'),
      ASPECT_4BY3 = 4 / 3,
      ASPECT_16BY9 = 16 / 9;

  class Settings extends DocElement {
    static get ASPECT_4BY3() { return ASPECT_4BY3; }
    static get ASPECT_16BY9() { return ASPECT_16BY9; }

    constructor() {
      super();
      this.setMember('aspect', new DocValue(ASPECT_16BY9));
    }

    getAspect() {
      return this.getMember('aspect').getValue();
    }
    setAspect(value) {
      this.getMember('aspect').setValue(value);
      return this;
    }
  }

  require('np.Serializer').register(name, Settings);

  return Settings;
});
