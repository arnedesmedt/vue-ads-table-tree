import RowCollection from '../collections/RowCollection';

export default class Paginate {
    constructor () {
        this.start = 0;
        this.end = 0;
    }

    set range ({start, end}) {
        this.start = start;
        this.end = end;
    }

    get range () {
        return {
            start: this.start,
            end: this.end,
        };
    }

    set start (start) {
        this._start = start;
    }

    get start () {
        return this._start;
    }

    set end (end) {
        this._end = end;
    }

    get end () {
        return this._end;
    }

    paginate (rowCollection) {
        return new RowCollection(rowCollection.items.slice(this.start, this.end));
    }
}
