import RowCollection from './RowCollection';

export default class PaginatedRowCollection extends RowCollection {
    constructor (rowCollection) {
        super();
        this.rowCollection = rowCollection;
        this.start = 0;
        this.end = 0;
    }

    set rowCollection (rowCollection) {
        this._rowCollection = rowCollection;
    }

    get rowCollection () {
        return this._rowCollection;
    }

    set items (items) {
        super.items = items;
    }

    get items () {
        return this.rowCollection.items.slice(this.start, this.end);
    }

    set range ({start, end}) {
        this.start = start;
        this.end = end;
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
}
