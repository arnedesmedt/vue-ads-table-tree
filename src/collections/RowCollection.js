import Row from '../models/Row';
import AbstractCollection from './AbstractCollection';

export default class RowCollection extends AbstractCollection {
    push (items, startIndex = null) {
        if (!Array.isArray(items)) {
            return super.push(items, startIndex);
        }

        super.push(
            items.map(item => {
                if (item === undefined || item instanceof Row) {
                    return item;
                }

                return new Row(item);
            }),
            startIndex
        );
    }

    flatten () {
        return [].concat(...this.items
            .map(row => [
                row,
            ].concat(row.visibleChildren.flatten())));
    }

    fullyFilled (totalRows) {
        return this.filled(totalRows) && this.childrenFilled();
    }

    filled (end, start = 0) {
        return super.filled(start, end);
    }

    childrenFilled () {
        return this.items
            .filter(row => row.hasChildren)
            .map(row => !row.childrenLoaded() || !row.children.childrenFilled())
            .filter(row => row)
            .length === 0;
    }

    filter (regex, properties) {
        if (regex.toString() === '/(?:)/i' || properties.length === 0) {
            return this;
        }

        let items = this.items.filter(row => {
            let rowMatch = row.propertyNames
                .filter(rowProperty => properties.includes(rowProperty))
                .filter(filterProperty => regex.test(row.properties[filterProperty]))
                .length > 0;

            if (!row.childrenLoaded()) {
                return rowMatch;
            }

            let filteredChildren = row.children.filter(regex, properties);

            if (filteredChildren.length === 0) {
                return rowMatch;
            }

            row.showChildren = true;
            row.visibleChildren = filteredChildren;

            return true;
        });

        return new RowCollection(items);
    }

    sort (columns) {
        if (!columns.length) {
            return this;
        }

        let rowsToSort = this.items;

        columns
            .forEach(column => {
                rowsToSort.sort((rowA, rowB) => {
                    let sortValueA = rowA.properties[column.property];
                    let sortValueB = rowB.properties[column.property];

                    if (typeof sortValueA === 'string' && typeof  sortValueB === 'string') {
                        return (column.direction ? 1 : -1) * ('' + sortValueA.localeCompare(sortValueB));
                    }

                    if (sortValueA < sortValueB) {
                        return -1;
                    }

                    if (sortValueA > sortValueB) {
                        return 1;
                    }

                    return 0;
                });
            });

        rowsToSort
            .filter(row => row.childrenLoaded())
            .filter(row => !row.visibleChildren.empty())
            .forEach(row => {
                row.visibleChildren = row.visibleChildren.sort(columns);
            });

        return new RowCollection(rowsToSort);
    }

    paginate (start, end) {
        return new RowCollection(this.items.slice(start, end));
    }

    initParent (parent) {
        this.items
            .filter(row => !row.parent)
            .forEach(row => {
                row.parent = parent;
            });
    }
}
