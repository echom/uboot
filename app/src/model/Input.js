np.define('model.Input', () => {
  var DocElement = np.require('np.DocElement'),
      DocValue = np.require('np.DocValue');

  class Input extends DocElement {
    constructor(entity, group, name, value) {
      super(entity);
      this.setMember('name', name);
      this.setMember('group', group || 'default');
      this.setMember('value', new DocValue(value));
    }

    getName() { return this.getMember('name'); }

    getGroup() { return this.getMember('group'); }

    getValue(state) { return this.getMember('value').getValue(); }

    setValue(state, value, force) {
      this.getMember('value').setValue(value, force);
      return this;
    }
  }

  return Input;
});
