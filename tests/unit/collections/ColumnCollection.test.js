import ColumnCollection from '../../../src/collections/ColumnCollection';
import Column from '../../../src/models/Column';

describe('ColumnCollection', () => {
    it('adds all columns', () => {
        const columnCollection = new ColumnCollection([
            new Column({
                property: 'firstName',
            }),
            new Column({
                property: 'lastName',
            }),
        ]);

        expect(columnCollection.length).toBe(2);
    });

    it('maps all columns', () => {
        const columnCollection = new ColumnCollection([
            {property: 'firstName'},
            {property: 'lastName'},
        ]);

        expect(columnCollection.length).toBe(2);
        expect(columnCollection.first).toBeInstanceOf(Column);
    });

    it('returns the filterValue columns', () => {
        const columnCollection = new ColumnCollection([
            {
                property: 'arne',
            },
            {
                property: 'de smedt',
                filterable: true,
            },
            {
                property: 'table',
                filterable: false,
            },
            {
                property: 'tree',
                filterable: true,
            },
        ]);

        expect(columnCollection.filterColumns()).toEqual([
            'de smedt',
            'tree',
        ]);
    });

    it('returns the sortable columns', () => {
        const columnCollection = new ColumnCollection([
            {
                property: 'arne',
            },
            {
                property: 'de smedt',
                sortable: true,
            },
            {
                property: 'table',
                sortable: false,
            },
            {
                property: 'tree',
                sortable: true,
            },
        ]);

        expect(columnCollection.sortColumns()[0]).toBeInstanceOf(Column);
        expect(columnCollection.sortColumns()[0].property).toBe('de smedt');
    });

    it('throws an error if the columns are not unique', () => {
        const columnCollection = () => new ColumnCollection([
            new Column({property: 'notUnique'}),
            new Column({property: 'notUnique'}),
        ]);

        expect(columnCollection).toThrow('ColumnCollection is not unique');
    });

    it('returns the max sort order', () => {
        const columnCollection = new ColumnCollection([
            {
                property: 'arne',
                sortOrder: 5,
                sortable: true,
            },
            {
                property: 'de smedt',
                sortOrder: 8,
            },
            {
                property: 'test',
                sortOrder: 4,
                sortable: true,
            },
            {
                property: 'otherTest',
                sortOrder: 16,
                sortable: true,
            },
        ]);

        expect(columnCollection.maxOrder()).toBe(16);
    });

    it('sorts on a specific column', () => {
        const column = new Column({
            property: 'name',
            sortable: true,
        });

        const columnCollection = new ColumnCollection([
            column,
        ]);

        columnCollection.sort(column);

        expect(column.order).toBe(1);
    });

    it('sorts the columns desc if they are sorting', () => {
        const column = new Column({
            property: 'name',
            sortable: true,
        });

        const column2 = new Column({
            property: 'address',
            sortable: true,
        });

        const columnCollection = new ColumnCollection([
            column,
            column2,
        ]);

        columnCollection.sort(column2);
        columnCollection.sort(column);

        expect(column2.order).toBe(1);
        expect(column.order).toBe(2);
    });
});
