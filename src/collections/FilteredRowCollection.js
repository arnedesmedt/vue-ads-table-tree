import RowCollection from './RowCollection';

export default class FilteredRowCollection extends RowCollection {
    constructor (rowCollection, columnCollection) {
        super();
        this.rowCollection = rowCollection;
        this.columnCollection = columnCollection;
        this.filter = '';
        this._length = rowCollection.length;
    }

    set rowCollection (rowCollection) {
        this._rowCollection = rowCollection;
    }

    get rowCollection () {
        return this._rowCollection;
    }

    set columnCollection (columnCollection) {
        this._columnCollection = columnCollection;
    }

    get columnCollection () {
        return this._columnCollection;
    }

    set items (items) {
        super.items = items;
    }

    get length () {
        return this._length;
    }

    get items () {
        let filterColumns = this.columnCollection.filterColumns();

        if (filterColumns.length === 0 || this.filter.length === 0) {
            this._length = this.rowCollection.length;
            return this.rowCollection.items;
        }

        let regex = new RegExp(this.filter, 'i');

        let filteredRows = this.rowCollection.items.filter(row => {
            let filterRow = this.filterRow(row, regex, filterColumns);

            if (!row.childrenLoaded()) {
                return filterRow;
            }

            let filteredChildrenRowCollection = new FilteredRowCollection(row.children, this.columnCollection);
            filteredChildrenRowCollection.filter = this.filter;

            let filterChildren = filteredChildrenRowCollection.items.length > 0;

            if (!filterRow && !filterChildren) {
                return false;
            }

            row.processedChildren = filteredChildrenRowCollection;
            row.showChildren = filterChildren;

            return true;
        });

        this._length = filteredRows.length;

        return filteredRows;
    }

    set filter (filter) {
        this._filter = filter;
    }

    get filter () {
        return this._filter.trim();
    }

    filterRow (row, regex, filterColumns) {
        return row.properties
            .reduce((start, property) => {
                if (start || !filterColumns.includes(property)) {
                    return start;
                }

                return regex.test(row[property]);
            }, false);
    }
}
