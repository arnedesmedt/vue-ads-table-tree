import ColumnCollection from '../../../src/collections/ColumnCollection';
import Column from '../../../src/models/Column';

describe('ColumnCollection', () => {
    it('adds all columns', function () {
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

    it('maps all columns', function () {
        const columnCollection = new ColumnCollection([
            {property: 'firstName'},
            {property: 'lastName'},
        ]);

        expect(columnCollection.length).toBe(2);
        expect(columnCollection.items[0]).toBeInstanceOf(Column);
    });

    it('returns the filter columns', function () {
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

    it('throws an error if the columns are not unique', function () {
        const columnCollection = () => new ColumnCollection([
            new Column({property: 'notUnique'}),
            new Column({property: 'notUnique'}),
        ]);

        expect(columnCollection).toThrow('ColumnCollection is not unique');
    });
});
