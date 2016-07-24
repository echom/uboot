np.define('ui.ListView', () => {
  var View = np.require('ui.View'),
      SelectionBehavior = np.require('ui.SelectionBehavior');

  class SelectedIndeces {
    constructor() {
      this.clear();
    }

    getList() { return this._list; }

    has(index) {
      return index in this._map;
    }

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

    _remove(index) {
      this._list.splice(this._map[index]);
      delete this._map[index];
    }

    _push(index) {
      this._map[index] = this._list.length;
      this._list.push(index);
    }
  }

  class ItemView extends View {
    constructor(application, item, type, classNames) {
      super(application, type, classNames);

      this._selection = new SelectionBehavior(this);
      this._item = item;
    }

    onSelected(handler, ctx) {
      return this._selection.onSelected(handler, ctx);
    }

    getItem() { return this._item; }

    _render(doc, el) {
      super._render(doc, el);
      this._selection.enable(el);
    }
  }

  class ListView extends View {
    static get ItemView() { return ItemView; }

    constructor(application, list, selectable, type, classNames) {
      super(application, type || 'ul', classNames);

      this._list = list;
      this._list.forEach(item => {
        this.add(this.createItemView(item, selectable));
      });
      this._list.onChanged(evt => {
        if (evt.removed) {
          this.removeAt(evt.index);
        } else if (evt.added) {
          this.insertAt(this.createItemView(evt.added, selectable), evt.index);
        }
      });

      this._selectable = selectable;
      this._selectedIndeces = new SelectedIndeces();
    }

    getList() { return this._list; }

    getSelectedItems() {
      var list = this._selectedIndeces.getList();
      return list.map(index => this.getChildren().get(index));
    }

    _createItemView(item) {
      return new ItemView(item);
    }

    createItemView(item, selectable) {
      var view = this._createItemView(item);
      if (!np.isA(view, ItemView)) {
        throw new Error('ListView.createItemView: view is not a ListItemView');
      }

      if (selectable) {
        view.onSelected(this._onItemSelected, this);
      }

      return view;
    }

    _onItemSelected(evt, src) {
      var index = this.getChildren().indexOf(src);

      if (evt.type === 'single' || this._selectable !== 'multi') {
        this._selectedIndeces.set(index);
      } else if (evt.type === 'toggle') {
        this._selectedIndeces.toggle(index);
      } else if (evt.type === 'range') {
        this._selectedIndeces.range(index);
      }

      this.getChildren().forEach((item, index) => {
        item.toggleClass('selected', this._selectedIndeces.has(index));
      });
    }
  }

  return ListView;
});
