np.define('app.Selection', (require, name) => {
  var Scene = require('model.Scene'),
      State = require('model.State'),
      Entity = require('model.Entity'),
      Event = require('np.Event'),
      ACCEPT_ANY = (() => true);

  class Group {
    static get acceptAny() { return ACCEPT_ANY; }

    constructor(name, acceptsFn) {
      this._name = name;
      this._items = [];
      this._changed = new Event(this);
      this._accepts = acceptsFn || Group.acceptAny;
    }

    getName() { return this._name; }

    getItems() { return this._items; }

    onChanged(handler, ctx) {
      return this._changed.on(handler, ctx);
    }
    _raiseChanged(index, added, removed) {
      if (this._changed.length) {
        this._changed.raise({
          index: index,
          added: added,
          removed: removed
        });
      }
    }

    accepts(object) { return this._accepts(object); }


  }

  class Selection {
    constructor() {
      this._sceneSelectionGroup = new Group('scenes', (o) => np.isA(o, Scene));
      this._stateSelectionGroup = new Group('states', (o) => np.isA(o, State));
      this._entitySelectionGroup = new Group('entities', (o) => np.isA(o, Entity));

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

    findGroupForObject(object) {
      var group = this._groups.find(selected => group.accepts(selected));
      if (!group) {
        throw new Error(name + '.findGroup: No group accepts the selection');
      }
      return group;
    }

    set(selected) {
      var group = this.findGroupForObject(selected);
      this._group.set(selected);
      this._currentGroup = group;
    }
  }

  return Selection;
});
