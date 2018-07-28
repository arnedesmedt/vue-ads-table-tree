import AbstractCollection from './AbstractCollection';
import ColumnCollection from './ColumnCollection';

export default class SortColumnCollection extends AbstractCollection {
    set items (columnCollection) {
        if (!(columnCollection instanceof ColumnCollection)) {
            throw new Error(
                'SortColumnCollection needs a ColumnCollection as input. \'' + typeof columnCollection + '\' given.'
            );
        }

        super.items = SortColumnCollection.mapToSortColumns(columnCollection.items);
    }

    get items () {
        return super.items;
    }

    static mapToSortColumns (columns) {
        return columns
            .filter(column => {
                return column.sortable || false;
            })
            .map(column => {
                return {
                    property: column.property,
                    direction: column.direction,
                };
            });
    }

    getSortColumn (column) {
        return this.items
            .reduce((start, sortColumn) => {
                if (start) {
                    return start;
                }

                if (sortColumn.property === column.property) {
                    return sortColumn;
                }

                return start;
            }, null);
    }

    sort (column) {
        this.items.sort((a, b) => {
            if (a.property === column.property) {
                return 1;
            }

            if (b.property === column.property) {
                return -1;
            }

            return 0;
        });

        let sortColumn = this.items[this.length - 1];

        if (sortColumn.property === column.property) {
            sortColumn.direction = !sortColumn.direction;
        }
    }

    // hasSortedColumns () {
    //     return this.sortColumns
    //         .filter(column => {
    //             return column.direction !== null;
    //         })
    //         .length > 0;
    // }
}
