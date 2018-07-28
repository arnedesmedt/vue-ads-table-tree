export default class Background {
    constructor (properties) {
        if (!(properties instanceof Object)) {
            properties = {};
        }

        this.even = properties.even || 'grey-lightest';
        this.odd = properties.odd || 'white';
        this.hover = properties.hover || 'grey-lighter';
    }

    set even (even) {
        this._even = even;
    }

    get even () {
        return this._even;
    }

    set odd (odd) {
        this._odd = odd;
    }

    get odd () {
        return this._odd;
    }

    set hover (hover) {
        this._hover = hover;
    }

    get hover () {
        return this._hover;
    }

    classes (rowIndex) {
        let backgroundClasses = {};

        if (rowIndex % 2 === 0 && this.even) {
            backgroundClasses['bg-' + this.even] = true;
        }

        if (rowIndex % 2 === 1 && this.odd) {
            backgroundClasses['bg-' + this.odd] = true;
        }

        if (this.hover) {
            backgroundClasses['hover:bg-' + this.hover] = true;
        }

        return backgroundClasses;
    }
}