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

    addItemsFromIndex (items, startIndex = null) {
        super.addItemsFromIndex(RowCollection.mapToRows(items), startIndex);
    }

    allRowsLoaded (totalRows) {
        if (!this.allRootRowsLoaded(totalRows)) {
            return false;
        }

        return RowCollection.allChildRowsLoaded(this);
    }

    allRootRowsLoaded (totalRows) {
        return this.length === totalRows && this.allItemsAreFilled();
    }

    static allChildRowsLoaded (rowCollection) {
        return rowCollection.items.reduce((start, row) => {
            if (!start) {
                return start;
            }

            if (!row.hasChildren) {
                return true;
            }

            if (row.children.isEmpty()) {
                return false;
            }

            return this.allChildRowsLoaded(row.children);
        }, true);
    }

    allRowsInRangeLoaded (range) {
        return this.allItemsAreFilledInRange(range);
    }
}
