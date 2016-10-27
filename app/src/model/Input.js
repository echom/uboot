np.define('model.Input', (require, name) => {
  var DocElement = require('np.DocElement');

  class Input extends DocElement {
    constructor(type, group, name, value) {
      super();
      this.setMember('name', name);
      this.setMember('group', group || 'default');
      this.setMember('value', value);
      this.setMember('type', type);
    }

    getName() { return this.getMember('name'); }

    getGroup() { return this.getMember('group'); }

    getEditor() { return this.getMember('editor'); }

    getValue(state) { return this.getMember('value').getValue(); }

    setValue(state, value, force) {
      this.getMember('value').setValue(value, force);
      return this;
    }
  }

  require('np.Serializer').register(name, Input);

  return Input;
});
