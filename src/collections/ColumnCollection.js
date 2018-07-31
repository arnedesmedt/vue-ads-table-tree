import Column from '../models/Column';
import AbstractCollection from './AbstractCollection';

export default class ColumnCollection extends AbstractCollection {
    set items (items) {
        let columns = ColumnCollection.mapToColumns(items);
        this.checkUniqueColumns(columns);

        super.items = columns;
    }

    get items () {
        return super.items;
    }

    static mapToColumns (items) {
        return items.map(item => {
            if (!(item instanceof Column)) {
                item = new Column(item);
            }

            return item;
        });
    }

    checkUniqueColumns (columns) {
        let columnProperties = columns.map(column => column.property);
        let set = new Set(columnProperties);

        if (set.size !== columnProperties.length) {
            throw new Error(
                'ColumnCollection is not unique'
            );
        }
    }

    filterColumns () {
        return this.items
            .filter(column => {
                return column.filterable || false;
            })
            .map(column => column.property);
    }
}
