export default class Styling {
    constructor (properties = {}) {
        if (!(properties instanceof Object)) {
            throw new Error(
                'Styling first argument has to be an object with the properties rowsEven, rowsOdd, rowsAll, rowsExceptLast, columnsEven, columnsOdd, columnsAll, columnsExceptLast and/or table.' +
                ' \'' + typeof properties + '\' given.'
            );
        }

        this.rowsEven = properties.hasOwnProperty('rowsEven') ? properties.rowsEven : 'vue-ads-table-tree-bg-grey-lightest';
        this.rowsOdd = properties.hasOwnProperty('rowsOdd') ? properties.rowsOdd : 'vue-ads-table-tree-bg-white';
        this.rowsAll = properties.hasOwnProperty('rowsAll') ? properties.rowsAll : 'vue-ads-table-tree-hover:bg-grey-lighter';
        this.rowsAllExceptLast = properties.hasOwnProperty('rowsAllExceptLast') ? properties.rowsAllExceptLast : 'vue-ads-table-tree-border-b';
        this.columnsEven = properties.hasOwnProperty('columnsEven') ? properties.columnsEven : '';
        this.columnsOdd = properties.hasOwnProperty('columnsOdd') ? properties.columnsOdd : '';
        this.columnsAll = properties.hasOwnProperty('columnsAll') ? properties.columnsAll : '';
        this.columnsAllExceptLast = properties.hasOwnProperty('columnsAllExceptLast') ? properties.columnsAllExceptLast : 'vue-ads-table-tree-border-r';
        this.table = properties.hasOwnProperty('table') ? properties.table : 'vue-ads-table-tree-border';
    }

    set rowsEven (rowsEven) {
        this._rowsEven = rowsEven;
    }

    get rowsEven () {
        return this._rowsEven;
    }

    set rowsOdd (rowsOdd) {
        this._rowsOdd = rowsOdd;
    }

    get rowsOdd () {
        return this._rowsOdd;
    }

    set rowsAll (rowsAll) {
        this._rowsAll = rowsAll;
    }

    get rowsAll () {
        return this._rowsAll;
    }

    set rowsAllExceptLast (rowsAllExceptLast) {
        this._rowsAllExceptLast = rowsAllExceptLast;
    }

    get rowsAllExceptLast () {
        return this._rowsAllExceptLast;
    }

    set columnsEven (columnsEven) {
        this._columnsEven = columnsEven;
    }

    get columnsEven () {
        return this._columnsEven;
    }

    set columnsOdd (columnsOdd) {
        this._columnsOdd = columnsOdd;
    }

    get columnsOdd () {
        return this._columnsOdd;
    }

    set columnsAll (columnsAll) {
        this._columnsAll = columnsAll;
    }

    get columnsAll () {
        return this._columnsAll;
    }

    set columnsAllExceptLast (columnsAllExceptLast) {
        this._columnsAllExceptLast = columnsAllExceptLast;
    }

    get columnsAllExceptLast () {
        return this._columnsAllExceptLast;
    }

    set table (table) {
        this._table = table;
    }

    get table () {
        return this._table;
    }

    rowClasses (index, last = false) {
        let rowClasses = {};

        if (index % 2 === 0 && this.rowsEven) {
            rowClasses[this.rowsEven] = true;
        }

        if (index % 2 === 1 && this.rowsOdd) {
            rowClasses[this.rowsOdd] = true;
        }

        if (!last && this.rowsAllExceptLast) {
            rowClasses[this.rowsAllExceptLast] = true;
        }

        if (this.rowsAll) {
            rowClasses[this.rowsAll] = true;
        }

        return rowClasses;
    }

    columnClasses (index, last = false) {
        let columnClasses = {};

        if (index % 2 === 0 && this.columnsEven) {
            columnClasses[this.columnsEven] = true;
        }

        if (index % 2 === 1 && this.columnsOdd) {
            columnClasses[this.columnsOdd] = true;
        }

        if (!last && this.columnsAllExceptLast) {
            columnClasses[this.columnsAllExceptLast] = true;
        }

        if (this.columnsAll) {
            columnClasses[this.columnsAll] = true;
        }

        return columnClasses;
    }

    tableClasses () {
        let tableClasses = {};

        if (this.table) {
            tableClasses[this.table] = true;
        }

        return tableClasses;
    }
}
