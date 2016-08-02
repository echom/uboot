np.define('ui.List', function() {
  var Event = np.require('np.Event'),
      Container = np.require('ui.Container'),
      Activation = np.require('ui.Activation');

  class Selection {
    constructor() {
      this.clear();
    }

    getList() { return this._list; }

    getCount() { return this._list.length; }

    has(index) { return index in this._map; }

    clear() {
      this._list = [];
      this._map = {};
    }

    set(index) {
      this.clear();
      this._push(index);
    }

    toggle(index) {
      if (this.has(index)) {
        this._remove(index);
      } else {
        this._push(index);
      }
    }

    range(index) {
      var tail = this._list[this._list.length - 1],
          min,
          max;

      if (!this._list.length) {
        this.set(index);
      } else if (tail !== index) {
        min = Math.min(tail, index);
        max = Math.max(tail, index);
        while (min <= max) {
          if (!this.has(min)) {
            this._push(min);
          }
          min++;
        }
      }
    }

    modify(index, type) {
      if (index === -1) {
        this.clear();
      } else if (type === 'single') {
        this.set(index);
      } else if (type === 'toggle') {
        this.toggle(index);
      } else if (type === 'range') {
        this.range(index);
      }
    }

    _remove(index) {
      this._list.splice(this._map[index]);
      delete this._map[index];
    }

    _push(index) {
      this._map[index] = this._list.length;
      this._list.push(index);
    }
  }

  class Item extends Container {
    constructor(type, classNames) {
      super(type || 'li', classNames);

      this._selected = false;
      this._selectable = false;
      this._selectRequested = new Event(this);
      this._activation = new Activation(this, (domEvt) => {
        var type = domEvt.shiftKey ? 'range' : (domEvt.metaKey || domEvt.ctrlKey) ? 'toggle' : 'single';
        this._raiseSelectRequested(type);
        domEvt.stopPropagation();
      });
    }

    isSelectable() { return this._selectable; }

    setSelectable(value, force) {
      if ((value !== this._selectable) || force) {
        if (this._element) {
          if (value) {
            this._activation.enable(this._element);
          } else {
            this._activation.disable();
          }
        }
        this._selectable = value;
      }
      return this;
    }

    isSelected() { return this._selected; }

    setSelected(value, force) {
      if ((value !== this._selected) || force) {
        this.toggleClass('selected', value);
        this._selected = value;
      }
      return this;
    }

    _render(doc, el) {
      super._render(doc, el);
      this.setSelected(this._selected, true);
      this.setSelectable(this._selectable, true);
    }

    onSelectRequested(handler, ctx) {
      return this._selectRequested.on(handler, ctx);
    }

    _raiseSelectRequested(type) {
      if (this._selectRequested.length) {
        this._selectRequested.raise({ type });
      }
    }
  }

  class List extends Container {
    static get SINGLE_SELECT() { return 'single'; }
    static get MULTI_SELECT() { return 'multi'; }
    static get NO_SELECT() { return false; }

    static get Item() { return Item; }

    constructor(type, selectable, classNames) {
      super(type || 'ul', classNames);

      this.setSelectable(selectable);
      this._selection = new Selection();
      this._selectionChanged = new Event(this);
    }

    isSelectable() { return this._selectable; }

    setSelectable(selectable, force) {
      this.getChildren().forEach(child => child.setSelectable(selectable, force));
      this._selectable = selectable;

      return this;
    }

    onSelectionChanged(handler, ctx) {
      return this._selectionChanged.on(handler, ctx);
    }

    clearSelection() {
      this._modifySelection(-1);
    }

    insertAt(child, index) {
      if (!np.isA(child, Item)) {
        throw new Error('List.insertAt: child is not a List.Item');
      }

      child.setSelectable(this._selectable);
      child.onSelectRequested(this._onItemSelectRequested, this);

      super.insertAt(child, index);
    }

    _raiseSelectionChanged() {
      if (this._selectionChanged.length) {
        this._selectionChanged.raise(null);
      }
    }

    _onItemSelectRequested(evt, src) {
      this._modifySelection(this.getChildren().indexOf(src), evt.type);
    }

    _modifySelection(index, type) {
      var selectionChanged = false;

      this._selection.modify(index, type);

      this.getChildren().forEach((child, index) => {
        var oldSelected = child.isSelected(),
            newSelected = this._selection.has(index);

        selectionChanged |= (oldSelected !== newSelected);
        child.setSelected(newSelected);
      }, this);

      if (selectionChanged) {
        this._raiseSelectionChanged();
      }
    }
  }

  return List;
});
