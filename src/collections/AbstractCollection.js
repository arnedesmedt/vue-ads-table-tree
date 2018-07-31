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

    // itemsInRangeSet (startIndex, endIndex, totalItems) {
    //     if (totalItems === 0) {
    //         totalItems = this.length;
    //     }
    //
    //     if (totalItems === 0) {
    //         return false;
    //     }
    //
    //     if (endIndex > totalItems) {
    //         endIndex = totalItems;
    //     }
    //
    //     for (let i = startIndex; i < endIndex; i++) {
    //         if (this.items[i] === undefined) {
    //             return false;
    //         }
    //     }
    //
    //     return true;
    // }
}
