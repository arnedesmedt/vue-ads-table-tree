import SortColumnCollection from '../../../src/collections/SortColumnCollection';
import Column from '../../../src/models/Column';
import ColumnCollection from '../../../src/collections/ColumnCollection';

describe('SortColumnCollection', () => {
    it('only adds the columns with a sortable property that is true', function () {
        const sortColumnCollection = new SortColumnCollection(
            new ColumnCollection([
                new Column({
                    property: 'firstName',
                    sortable: true,
                }),
                new Column({
                    property: 'lastName',
                    sortable: false,
                }),
            ])
        );

        expect(sortColumnCollection.length).toBe(1);
        expect(sortColumnCollection.items[0].property).toBe('firstName');
    });

    it('only holds the property and direction attribute', function () {
        const sortColumnCollection = new SortColumnCollection(
            new ColumnCollection([
                new Column({
                    property: 'firstName',
                    sortable: true,
                    direction: true,
                    name: 'arne',
                }),
            ])
        );

        let sortColumn = sortColumnCollection.items[0];
        expect(sortColumn.name).toBeUndefined();
        expect(sortColumn.sortable).toBeUndefined();
        expect(sortColumn.property).toBe('firstName');
        expect(sortColumn.direction).toBeTruthy();
    });

    it('throws an error if the argument is no ColumnCollection', function () {
        const sortColumnCollection = () => new SortColumnCollection(1);

        expect(sortColumnCollection).toThrow(Error);
    });

    it('uses the default direction null if there is no direction set', function () {
        const sortColumnCollection = new SortColumnCollection(
            new ColumnCollection([
                new Column({
                    property: 'firstName',
                    sortable: true,
                }),
            ])
        );

        expect(sortColumnCollection.items[0].direction).toBeNull();
    });

    it('returns a sortColumn or null when calling getSortColumn', function () {
        const sortColumnCollection = new SortColumnCollection(
            new ColumnCollection([
                new Column({
                    property: 'firstName',
                    sortable: true,
                }),
                new Column({
                    property: 'lastName',
                    sortable: true,
                }),
            ])
        );

        expect(sortColumnCollection.getSortColumn({property: 'firstName'})).toEqual({
            property: 'firstName',
            direction: null,
        });
        expect(sortColumnCollection.getSortColumn({property: 'whatEver'})).toBeNull();
    });

    it('sorts the columns when sorting', function () {
        const sortColumnCollection = new SortColumnCollection(
            new ColumnCollection([
                new Column({
                    property: 'firstName',
                    sortable: true,
                }),
                new Column({
                    property: 'lastName',
                    sortable: true,
                }),
                new Column({
                    property: 'address',
                    sortable: true,
                }),
            ])
        );

        let getProperties = (sortColumnCollection) => {
            return sortColumnCollection.items.map(sortColumn => sortColumn.property);
        };

        sortColumnCollection.sort({property: 'firstName'});

        expect(getProperties(sortColumnCollection)).toEqual([
            'lastName',
            'address',
            'firstName',
        ]);
        expect(sortColumnCollection.getSortColumn({property: 'firstName'}).direction).toBeTruthy();

        sortColumnCollection.sort({property: 'address'});

        expect(getProperties(sortColumnCollection)).toEqual([
            'lastName',
            'firstName',
            'address',
        ]);

        sortColumnCollection.sort({property: 'address'});

        expect(sortColumnCollection.getSortColumn({property: 'address'}).direction).toBeFalsy();

        sortColumnCollection.sort({property: 'address'});

        expect(sortColumnCollection.getSortColumn({property: 'address'}).direction).toBeTruthy();

        sortColumnCollection.sort({property: 'whatEver'});

        expect(getProperties(sortColumnCollection)).toEqual([
            'lastName',
            'firstName',
            'address',
        ]);
    });
});
