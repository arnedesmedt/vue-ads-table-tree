import Column from '../models/Column';
import AbstractCollection from './AbstractCollection';

export default class ColumnCollection extends AbstractCollection {
    set items (items) {
        super.items = ColumnCollection.mapToColumns(items);
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

    filterColumns () {
        return this.items
            .filter(column => {
                return column.filterable || false;
            })
            .map(column => column.property);
    }
}
