import Row from '../models/Row';
import AbstractCollection from './AbstractCollection';

export default class RowCollection extends AbstractCollection {
    set items (items) {
        super.items = RowCollection.mapToRows(items);
    }

    get items () {
        return super.items;
    }

    static mapToRows (items) {
        return items.map(item => {
            if (!(item instanceof Row)) {
                item = new Row(item);
            }

            return item;
        });
    }

    flatten () {
        let result = [];

        this.items.forEach(row => {
            result.push(row);
            if (row.showChildren) {
                result = result.concat(row.processedChildren.flatten());
            }
        });

        return result;
    }

    addItemsOnIndex (items, startIndex = null) {
        super.addItemsOnIndex(RowCollection.mapToRows(items), startIndex);
    }

    // allItemsLoaded  (totalRootItems) {
    //     if (this.length < totalRootItems) {
    //         return false;
    //     }
    //
    //     return this.allChildItemsLoaded(this);
    // }

    // allChildItemsLoaded (rowCollection) {
    //     return rowCollection.items.reduce((start, row) => {
    //         if (!start) {
    //             return start;
    //         }
    //
    //         if (row.hasChildren && row.children.empty) {
    //             return false;
    //         }
    //
    //         if (!row.hasChildren) {
    //             return true;
    //         }
    //
    //         return this.allChildItemsLoaded(row.children);
    //     }, true)
    // }
}
