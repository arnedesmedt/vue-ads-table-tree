import Vue from 'vue';

export default class AbstractCollection {
    constructor (items = []) {
        this._items = [];
        this.items = items;
    }

    get length () {
        return this._items.length;
    }

    set items (items) {
        this.clear();
        this.addItemsFromIndex(items);
    }

    get items () {
        return this._items;
    }

    get first () {
        return this.items[0];
    }

    get last () {
        return this.items[this.length - 1];
    }

    clear () {
        this._items.splice(0, this.length);
    }

    addItemOnIndex (item, index = null) {
        index = index === null ? this.length : index;
        Vue.set(this._items, index, item);

        return item;
    }

    addItemsFromIndex (items, startIndex = null) {
        if (!(items instanceof Array)) {
            throw new Error(
                'Items has to be an Array, if you want to add items to a collection. \'' + typeof items + '\' given.'
            );
        }

        return items.map((item, index) => {
            return this.addItemOnIndex(
                item,
                startIndex !== null ? startIndex + index : null
            );
        });
    }

    isEmpty () {
        return this.length === 0;
    }

    allItemsAreFilled () {
        return AbstractCollection.itemsAreFilled(this.items);
    }

    static itemsAreFilled (items) {
        return items.length === items.filter(item => true).length;
    }

    allItemsAreFilledInRange (range) {
        let slicedItems = this.items.slice(range.start, range.end);

        if ((range.end - range.start) === 0) {
            return true;
        }

        if (slicedItems.length < range.end - range.start) {
            return false;
        }

        return AbstractCollection.itemsAreFilled(slicedItems);
    }

    extendToLength (length) {
        this.items[length - 1] = undefined;
    }
}
