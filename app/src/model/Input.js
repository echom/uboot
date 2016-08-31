np.define('model.Input', () => {
  var Element = np.require('doc.Element'),
      Value = np.require('doc.Value');

  class Input extends Element {
    constructor(entity, group, name, value) {
      super(entity);
      this.setMember('name', name);
      this.setMember('group', group || 'default');
      this.setMember('value', new Value(this, value));
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
