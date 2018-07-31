export default class Border {
    constructor (properties = {}) {
        if (!(properties instanceof Object)) {
            throw new Error(
                'Border first argument has to be an object with the properties horizontal, vertical or outline.' +
                '\'' + typeof properties + 'given.'
            );
        }

        this.horizontal = properties.hasOwnProperty('horizontal') ? properties.horizontal : true;
        this.vertical = properties.hasOwnProperty('vertical') ? properties.vertical : true;
        this.outline = properties.hasOwnProperty('outline') ? properties.outline : true;
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

        return {['border ' + (typeof this.outline === 'string' ? this.outline : '')]: true};
    }

    rowClasses (last = false) {
        if (last || !this.horizontal) {
            return {};
        }

        return {['border-b ' + (typeof this.horizontal === 'string' ? this.horizontal : '')]: true};
    }

    columnClasses (last = false) {
        if (last || !this.vertical) {
            return {};
        }

        return {['border-r ' + (typeof this.vertical === 'string' ? this.vertical : '')]: true};
    }
}
