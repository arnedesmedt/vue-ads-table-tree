export default class Border {
    constructor (properties = {}) {
        if (!(properties instanceof Object)) {
            properties = {};
        }

        this.horizontal = properties.horizontal || true;
        this.vertical = properties.vertical || true;
        this.outline = properties.outline || true;
    }

    set horizontal (horizontal) {
        this._horizontal = horizontal;
    }

    get horizontal () {
        return this._horizontal;
    }

    set vertical (vertical) {
        this._vertical = vertical;
    }

    get vertical () {
        return this._vertical;
    }

    set outline (outline) {
        this._outline = outline;
    }

    get outline () {
        return this._outline;
    }

    tableClasses () {
        if (!this.outline) {
            return {};
        }

        return {['border ' + (this.outline instanceof String ? this.outline : '')]: true};
    }

    rowClasses (last) {
        if (last || !this.horizontal) {
            return {};
        }

        return {['border-b ' + (this.horizontal instanceof String ? this.horizontal : '')]: true};
    }

    columnClasses (last) {
        if (last || !this.vertical) {
            return {};
        }

        return {['border-r ' + (this.vertical instanceof String ? this.vertical : '')]: true};
    }
}
