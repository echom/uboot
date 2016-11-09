np.define('np.List', () => {

  /**
   * The List class represents an ordered collection.
   * @memberof np
   */
  class List {

    /**
     * Constructs a new, empty list.
     */
    constructor() {
      this._items = [];
    }

    /**
     * Returns the number of items in this list.
     * @type {number}
     */
    get length() { return this._items.length; }

    /**
     * Returns the item at the specified index.
     * @param {number} index - the index from which to retrieve the item
     * @return {*} the item at the specified index or undefined if the index is
     *    out of bounds
     */
    get(index) { return this._items[index]; }

    /**
     * Return the first item from this list.
     * @return {*} the first item or undefined if this list is empty
     */
    first() { return this._items[0]; }

    /**
     * Return the last item from this list.
     * @return {*} the last item or undefined if this list is empty
     */
    last() { return this._items[this._items.length - 1]; }

    /**
     * Returns the index of the provided item within this list.
     * @param {*} item - the item for which the index is to be determined
     * @return {number} the index of the item in the list or -1 if this item is
     *    is not contained within this list
     */
    indexOf(item) { return this._items.indexOf(item); }

    /**
     * Returns a boolean indicating whether the provided item is contained
     * within this list.
     * @param {*} item - the item to check
     * @return {boolean} a boolean value indicating whether the provided item
     *    is included in this list
     */
    includes(item) { return this.indexOf(item) >= 0; }

    /**
     * Iterates over all items in this list calling the provided callback. An
     * optional context object to use as 'this' for the callback may be passed
     * as a second argument.
     * @param {np.List~ForEachCallback} fn the callback to invoke for every item
     * @param {object} [ctx] - an optional context object to use as 'this'
     */
    forEach(fn, ctx) { this._items.forEach(fn, ctx); }

    /**
     * Returns the first item in the list which matches the provided predicate
     * function (i.e. for which the function returns true). An optional context
     * object may be passed as a second argument.
     * @param {np.List~FindCallback} fn the callback to invoke for every item
     * @param {object} [ctx] - an optional context object to use as 'this'
     * @return {*} the matching item or undefined if no item matches the
     *    predicate function
     */
    find(fn, ctx) { return this._items.find(fn, ctx); }

    /**
     * Adds the provided item to the list.
     * @param {*} item - the item to add to the end of the list
     * @return {*} the added item
     */
    add(item) { return this.insertAt(item, this._items.length); }

    /**
     * Removes the provided item from the list. If the item is not contained
     * within the list it is ignored.
     * @param {*} item - the item to remove from this list
     * @return {*} the removed item or undefined if the item is not contained
     *    within the list
     */
    remove(item) { return this.removeAt(this._items.indexOf(item)); }

    /**
     * Inserts an item at the specified index. If the specified index is out of
     * bounds
     * the action is ignored.
     * @param {*} item - the item to be inserted
     * @param {number} index - the index at which to insert the item
     * @return {*} the inserted item
     */
    insertAt(item, index) {
      if (!item) {
        throw new Error('np.List#insertAt: item is undefined');
      }

      if (index >= 0 && index <= this._items.length) {
        this._items.splice(index, 0, item);
      }
      return item;
    }

    /**
     * Removes the item at the specified index. If the index is out of bounds
     * the action is ignored.
     * @param {number} index - the index at which to remove an item
     * @return {*} the removed item or undefined if the index is out of bounds
     */
    removeAt(index) {
      var item;
      if (index >= 0 && index < this._items.length) {
        item = this._items[index];
        this._items.splice(index, 1);
      }
      return item;
    }

    /**
     * Replaces the item at the specified index with the provided one. If the
     * index is out of bounds the action is ignored.
     * @param {*} item - the item to place into the list
     * @param {number} index - the index at which to replace the item
     * @return {*} the removed item
     */
    replaceAt(item, index) {
      var removed;
      if (index >= 0 && index <= this._items.length) {
        removed = this.removeAt(index);
        this.insertAt(item, index);
      }
      return removed;
    }

    /**
     * Removes all elements from this list.
     */
    clear() {
      while (this._items.length) {
        this.removeAt(0);
      }
    }

    /**
     * Turns this list into an plain array applying the provided mapping
     * function.
     */
    toArray(mapFn, ctx) {
      return this._items.map(mapFn || (i => i), ctx);
    }
  }

  return List;
});
