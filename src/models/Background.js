export default class Background {
    constructor (properties = {}) {
        if (!(properties instanceof Object)) {
            throw new Error(
                'Background first argument has to be an object with the properties even, odd and/or hover. ' +
                '\'' + typeof properties + 'given.'
            );
        }

        this.even = properties.hasOwnProperty('even') ? properties.even : 'grey-lightest';
        this.odd = properties.hasOwnProperty('odd') ? properties.odd : 'white';
        this.hover = properties.hasOwnProperty('hover') ? properties.hover : 'grey-lighter';
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
