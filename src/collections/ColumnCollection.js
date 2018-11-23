import Column from '../models/Column';
import AbstractCollection from './AbstractCollection';

export default class ColumnCollection extends AbstractCollection {
    get properties () {
        return this.items.map(column => column.property);
    }

    get filterColumnNames () {
        return this.items
            .filter(column => column.filterable)
            .map(column => column.property);
    }

    push (items, startIndex) {
        if (!Array.isArray(items)) {
            return super.push(items, startIndex);
        }

        return super.push(
            items.map(item => {
                if (item instanceof Column) {
                    return item;
                }

                return new Column(item);
            }),
            startIndex
        );
    }

    sortableColumns () {
        return this.items
            .filter(column => column.sortable);
    }

    sortColumns () {
        return this.sortableColumns()
            .filter(column => column.direction !== null)
            .sort((columnA, columnB) => columnA.order - columnB.order);
    }

    sort (column) {
        column.sort(this.maxOrder() + 1);
    }

    maxOrder () {
        let sortColumns = this.sortableColumns();

        return sortColumns[sortColumns.length - 1].order;
    }

    hasFilterColumns () {
        console.log(this.filterColumnNames);
        return this.filterColumnNames.length > 0;
    }
}
