import Vue from 'vue';

export default class AbstractCollection {
    constructor (items = []) {
        this._items = [];
        this.items = items;
    }

    set items (items) {
        this.clear();
        this.push(items);
    }

    get items () {
        return this._items;
    }

    get length () {
        return this.items.length;
    }

    set length (length) {
        this._items.length = length;
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

    push (items, startIndex = null) {
        if (Array.isArray(items)) {
            return items.map((item, index) => {
                return this.push(item, startIndex !== null ? startIndex + index : null);
            });
        }

        Vue.set(this._items, startIndex || this.length, items);

        return items;
    }

    empty () {
        return this.length === 0;
    }

    filled (start = undefined, end = undefined) {
        let items = this.items.slice(start, end);

        start = start < 0 ? this.length + start : start;
        start = start < 0 ? 0 : start;
        end = end < 0 ? this.length + end : end;
        end = end < 0 ? 0 : end;

        return end - start === items.filter(item => item).length;
    }
}
