import RowCollection from '../collections/RowCollection';

export default class Filter {
    constructor (columnCollection) {
        this.columnCollection = columnCollection;
        this.filterValue = '';
    }

    set columnCollection (columnCollection) {
        this._columnCollection = columnCollection;
    }

    get filterColumns () {
        return this._columnCollection.filterColumns();
    }

    set filterValue (filterValue) {
        this._filterValue = filterValue.trim();
    }

    get filterValue () {
        return this._filterValue;
    }

    filter (rowCollection) {
        if (this.filterColumns.length === 0 || this.filterValue.length === 0) {
            return rowCollection;
        }

        let regex = new RegExp(this.filterValue, 'i');

        let filteredRows = rowCollection.items.filter(row => {
            let filterRow = this.filterRow(row, regex);

            if (!row.childrenLoaded()) {
                return filterRow;
            }

            let filteredChildren = this.filter(row.children);
            let filterChildren = filteredChildren.length > 0;

            if (!filterRow && !filterChildren) {
                return false;
            }

            row.processedChildren = filteredChildren;
            row.showChildren = filterChildren;

            return true;
        });

        return new RowCollection(filteredRows);
    }

    filterRow (row, regex) {
        return row.properties
            .reduce((start, property) => {
                if (start || !this.filterColumns.includes(property)) {
                    return start;
                }

                return regex.test(row[property]);
            }, false);
    }

    isFiltering () {
        return this.filterValue.length > 0;
    }
}
