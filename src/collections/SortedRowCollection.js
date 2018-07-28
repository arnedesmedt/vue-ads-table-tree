import RowCollection from './RowCollection';

export default class SortedRowCollection extends RowCollection {
    constructor (rowCollection, sortColumnCollection) {
        super();
        this.rowCollection = rowCollection;
        this.sortColumnCollection = sortColumnCollection;
    }

    set rowCollection (rowCollection) {
        this._rowCollection = rowCollection;
    }

    get rowCollection () {
        return this._rowCollection;
    }

    set sortColumnCollection (sortColumnCollection) {
        this._sortColumnCollection = sortColumnCollection;
    }

    get sortColumnCollection () {
        return this._sortColumnCollection;
    }

    set items (items) {
        super.items = items;
    }

    get items () {
        this.sortColumnCollection.items.forEach(sortBy => {
            if (sortBy.direction === null) {
                return;
            }

            this.rowCollection.items.sort((a, b) => {
                a = a[sortBy.property];
                b = b[sortBy.property];

                if (a < b) {
                    return sortBy.direction ? -1 : 1;
                }

                if (a > b) {
                    return sortBy.direction ? 1 : -1;
                }

                return 0;
            });
        });

        this.rowCollection.items.forEach(row => {
            if (!row.childrenLoaded()) {
                return;
            }

            row.processedChildren = new SortedRowCollection(row.processedChildren, this.sortColumnCollection);
        });

        return this.rowCollection.items;
    }
}
