np.define('np.DocElement', (require, name) => {
  var Event = require('np.Event'),
      DocNode = require('np.DocNode');

  class ChangedEvent extends Event {
    raise(index, added, removed) {
      if (this.length) {
        super.raise({
          index: index,
          added: added,
          removed: removed
        });
      }
    }
  }

  class DocElement extends DocNode {
    constructor() {
      super();

      this._members = {};
      this._changed = new ChangedEvent();
    }

    setMember(name, newValue, force) {
      var oldValue = this.getMember(name);

      if ((oldValue !== newValue) || force) {
        if (oldValue instanceof DocNode) {
          oldValue.setParent(null);
        }

        this._members[name] = newValue;

        if (newValue instanceof DocNode) {
          newValue.setParent(this);
        }

        this._changed.raise(name, newValue, oldValue);
      }

      return this;
    }

    getMember(name) { return this._members[name]; }

    getMemberList() { return Object.keys(this._members).map(key => this._members[key]); }

    onChanged(handler, ctx) { return this._changed.on(handler, ctx); }

    forEach(fn, ctx) {
      var key;
      for (key in this._members) {
        fn.call(ctx, this._members[key], key);
      }
    }

    _dispose() {
      super._dispose();
      this.forEach(m => m.dispose());
    }

    _orphan() {
      super._orphan();
      this.forEach(m => m._orphan(null));
    }
    _adopt(doc) {
      super._adopt(doc);
      this.forEach(m => m._adopt(doc));
    }

    serialize(serializer) {
      var members = {};
      super.serialize(serializer);
      this.forEach(
        (member, name) => members[name] = serializer.serialize(member)
      );
      serializer.write('members', members);
    }
    deserialize(serializer) {
      var members = serializer.read('members'),
          key;
      for (key in members) {
        this.setMember(key, serializer.deserialize(members[key]));
      }
    }
  }

  np.require('np.Serializer').register(name, DocElement);

  return DocElement;
});
