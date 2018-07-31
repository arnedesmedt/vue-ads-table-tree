export default class Column {
    constructor (properties) {
        Object.assign(this, properties);

        if (
            !this.hasOwnProperty('property') ||
            typeof this.property !== 'string'
        ) {
            throw new Error(
                'Each column needs a unique property attribute of the type string'
            );
        }

        this.width = 'auto';
        this.sortable = this.hasOwnProperty('_sortable') ? this.sortable : false;
        this.direction = this.hasOwnProperty('_direction') ? this.direction : null;
        this.filterable = this.hasOwnProperty('_filterable') ? this.filterable : false;
    }

    set width (width) {
        this._width = width;
    }

    get width () {
        return this._width;
    }

    set sortable (sortable) {
        this._sortable = sortable;
    }

    get sortable () {
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
        return this._direction;
    }

    set filterable (filterable) {
        this._filterable = filterable;
    }

    get filterable () {
        return this._filterable;
    }
}
