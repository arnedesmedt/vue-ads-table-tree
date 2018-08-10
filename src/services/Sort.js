import RowCollection from '../collections/RowCollection';

export default class Sort {
    constructor (columnCollection) {
        this.columnCollection = columnCollection;
    }

    set columnCollection (columnCollection) {
        this._columnCollection = columnCollection;
    }

    get sortColumns () {
        return this._columnCollection.sortColumns();
    }

    sort (rowCollection) {
        let rowsToSort = rowCollection.items;
        this.sortColumns.forEach(sortBy => {
            if (sortBy.direction === null) {
                return;
            }

            rowsToSort.sort((a, b) => {
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

        rowsToSort.forEach(row => {
            if (!row || !row.childrenLoaded()) {
                return;
            }

            row.processedChildren = this.sort(row.processedChildren);
        });

        return new RowCollection(rowsToSort);
    }

    hasSortedColumns () {
        return this.sortColumns
            .filter(column => {
                return column.direction !== null;
            })
            .length > 0;
    }
}
