import Column from '../models/Column';
import AbstractCollection from './AbstractCollection';

export default class ColumnCollection extends AbstractCollection {
    constructor (items = []) {
        super(items);

        if (!this.hasCollapseIcon() && !this.empty()) {
            this.first.collapseIcon = true;
        }
    }

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
        let sortColumns = this.sortColumns();

        if (sortColumns.length === 0) {
            return 0;
        }

        return sortColumns[sortColumns.length - 1].order;
    }

    hasFilterColumns () {
        return this.filterColumnProperties.length > 0;
    }

    hasCollapseIcon () {
        return this.items.find(column => column.collapseIcon);
    }
}
