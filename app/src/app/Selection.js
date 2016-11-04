np.define('app.Selection', (require, name) => {
  var Scene = require('model.Scene'),
      State = require('model.State'),
      Entity = require('model.Entity'),
      Event = require('np.Event'),
      ACCEPT_ANY = (() => true),
      ACTION_SETSINGLE = 'single',
      ACTION_SETMULTI = 'multi',
      ACTION_CLEAR = 'empty';

  class SelectionGroup {
    static get acceptAny() { return ACCEPT_ANY; }

    constructor(name, acceptsFn) {
      this._name = name;
      this._items = [];
      this._changed = new Event(this);
      this._accepts = acceptsFn || SelectionGroup.acceptAny;
    }

    getName() { return this._name; }

    getItems() { return this._items; }

    onChanged(handler, ctx) {
      return this._changed.on(handler, ctx);
    }
    _raiseChanged(action, operand) {
      if (this._changed.length) {
        this._changed.raise({
          action: action,
          operand: operand
        });
      }
    }

    accepts(obj) { return this._accepts(obj); }
    _validateAccepts(obj) {
      if (!this.accepts(obj)) {
        throw new Error(name + ': This group does not accept the object.');
      }
    }

    isEmpty() { return this._items.size === 0; }
    isSingle() { return this._items.size === 1; }
    isMulti() { return this._items.size > 1; }

    getSingle() { return this._items.values().next().value; }

    setSingle(obj) {
      this._validateAccepts(obj);

      if (!this.isSingle() || this.getSingle() !== obj) {
        this._items.length = 0;
        this._items.push(obj);
        this._raiseChanged(ACTION_SETSINGLE, obj);
      }
    }

    setMulti(objs) {
      if (!this.isEmpty()) {
        this._items.length = 0;
        objs.forEach((obj) => this._items.push(objs));
        this._raiseChanged()
      }
    }

    clear() {
      if (this._items.length !== 0) {
        this._items.length = 0;
        this._raiseChanged(ACTION_CLEAR);
      }
    }
  }

  class EntitySelectionGroup extends SelectionGroup {
    constructor() {
      super('entities', (o) => np.isA(o, Entity));
    }

    getInputList() {
      return this._items[0].getInputList();
    }
  }

  class Selection {
    static get SelectionGroup() { return SelectionGroup; }

    constructor() {
      this._sceneSelectionGroup = new SelectionGroup('scenes', (o) => np.isA(o, Scene));
      this._stateSelectionGroup = new SelectionGroup('states', (o) => np.isA(o, State));
      this._entitySelectionGroup = new EntitySelectionGroup();

      this._groups = [
        this._entitySelectionGroup,
        this._stateSelectionGroup,
        this._sceneSelectionGroup
      ];
      this._currentGroup = null;

      this._changed = new Event(this);
    }

    getEntityGroup() { return this._entitySelectionGroup; }
    getStateGroup() { return this._stateSelectionGroup; }
    getSceneGroup() { return this._sceneSelectionGroup; }

    getCurrentGroup() { return this._currentGroup; }
    setCurrentGroup(group) { this._currentGroup = group; }

    findGroupForObject(obj) {
      var group = this._groups.find(group => group.accepts(obj));
      if (!group) {
        throw new Error(name + '.findGroupForObject: No group accepts the selection');
      }
      return group;
    }

    set(selected) {
      var group = this.findGroupForObject(selected);
      group.setSingle(selected);
      this._currentGroup = group;
    }
  }

  return Selection;
});
