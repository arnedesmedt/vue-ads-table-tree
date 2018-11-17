export default class Column {
    constructor (properties) {
        Object.assign(this, properties);
    }

    set property (property) {
        this._property = property;
    }

    get property () {
        if (!this.hasOwnProperty('_property')) {
            return '';
        }

        return this._property;
    }

    set width (width) {
        this._width = width;
    }

    get width () {
        if (!this.hasOwnProperty('_width')) {
            return 'auto';
        }

        return this._width;
    }

    set order (order) {
        this._order = order;
    }

    get order () {
        if (!this.hasOwnProperty('_order')) {
            return 0;
        }

        return this._order;
    }

    set sortable (sortable) {
        this._sortable = sortable;
    }

    get sortable () {
        if (!this.hasOwnProperty('_sortable')) {
            return false;
        }

        return this._sortable;
    }

    set direction (direction) {
        if (![true, false, null].includes(direction)) {
            throw new Error(
                'Sort direction has to be true (asc), false (desc) or null (no sorting)',
            );
        }

        this._direction = direction;
    }

    get direction () {
        if (!this.hasOwnProperty('_direction')) {
            return null;
        }

        return this._direction;
    }

    set filterable (filterable) {
        this._filterable = filterable;
    }

    get filterable () {
        if (!this.hasOwnProperty('_filterable')) {
            return false;
        }

        return this._filterable;
    }

    sort (order) {
        this.direction = !this.direction;
        this.order = order;
    }
}
