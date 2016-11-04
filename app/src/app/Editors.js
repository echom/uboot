np.define('app.Editors', (require, name) => {
  class EditorFactory {
    constructor() {
      this._editors = {};
    }

    register(name, editor) {
      this._editors[name] = editor;
    }

    forInput(input) {
      var request = input.getType(),
          Editor = this._editors[request];
      if (!Editor) {
        throw new Error(name + '.forInput: Cannot find editor for request: ' + request);
      } else {
        return new Editor(input);
      }
    }
  }

  return new EditorFactory();
});
