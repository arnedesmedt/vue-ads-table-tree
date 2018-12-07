export default class Column {
    constructor (properties) {
        Object.assign(this, properties);
    }

    set property (property) {
        this._property = property;
    }

    get property () {
        if (!this.hasOwnProperty('_property')) {
            this._property = '';
        }

        return this._property;
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

    set collapseIcon (collapseIcon) {
        this._collapseIcon = collapseIcon;
    }

    get collapseIcon () {
        if (!this.hasOwnProperty('_collapseIcon')) {
            this._collapseIcon = false;
        }

        return this._collapseIcon;
    }

    set sortable (sortable) {
        this._sortable = sortable;
    }

    get sortable () {
        if (!this.hasOwnProperty('_sortable')) {
            this._sortable = false;
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
            this._direction = null;
        }

        return this._direction;
    }

    set filterable (filterable) {
        this._filterable = filterable;
    }

    get filterable () {
        if (!this.hasOwnProperty('_filterable')) {
            this._filterable = false;
        }

        return this._filterable;
    }

    sort (order) {
        this.direction = !this.direction;
        this.order = order;
    }
}
