np.define('model.Input', (require, name) => {
  var DocElement = require('np.DocElement'),
      DocValue = require('np.DocValue');

  class Input extends DocElement {
    constructor(type, group, name, value) {
      super();
      this.setMember('name', new DocValue(name));
      this.setMember('group', new DocValue(group || 'default'));
      this.setMember('type', new DocValue(type));
      this.setMember('value', value);
    }

    getName() { return this.getMember('name').getValue(); }

    getGroup() { return this.getMember('group').getValue(); }

    getType() { return this.getMember('type').getValue(); }

    getValue(state) { return this.getMember('value'); }

    setValue(state, value, force) {
      this.getMember('value').setValue(value, force);
      return this;
    }
  }

  require('np.Serializer').register(name, Input);

  return Input;
});
