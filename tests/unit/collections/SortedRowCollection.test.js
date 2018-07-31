import SortedRowCollection from '../../../src/collections/SortedRowCollection';
import Row from '../../../src/models/Row';
import RowCollection from '../../../src/collections/RowCollection';
import SortColumnCollection from '../../../src/collections/SortColumnCollection';
import ColumnCollection from '../../../src/collections/ColumnCollection';
import Column from '../../../src/models/Column';

describe('SortedRowCollection', () => {
    let sortedRowCollection;
    let sortColumnCollection;

    beforeEach(() => {
        const rowCollection = new RowCollection([
            new Row({
                firstName: 'table',
                lastName: 'tree',
                children: [
                    new Row({
                        firstName: 'b',
                        lastName: 'null',
                    }),
                    new Row({
                        firstName: 'a',
                        lastName: 'null',
                    }),
                ],
            }),
            new Row({
                firstName: 'arne',
                lastName: 'ze smedt',
            }),
            new Row({
                firstName: 'arne',
                lastName: 'de smedt',
            }),
        ]);

        sortColumnCollection = new SortColumnCollection(
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

        sortedRowCollection = new SortedRowCollection(
            rowCollection,
            sortColumnCollection
        );
    });

    it('sorts all the root rows asc', function () {
        sortColumnCollection.sort({property: 'firstName'});

        let rows = sortedRowCollection.items;
        expect(rows[0].lastName).toBe('ze smedt');
        expect(rows[1].lastName).toBe('de smedt');
        expect(rows[2].lastName).toBe('tree');
    });

    it('sorts all the root rows desc', function () {
        sortColumnCollection.sort({property: 'firstName'});
        sortColumnCollection.sort({property: 'firstName'});

        let rows = sortedRowCollection.items;
        expect(rows[0].lastName).toBe('tree');
        expect(rows[1].lastName).toBe('ze smedt');
        expect(rows[2].lastName).toBe('de smedt');
    });

    it('sorts the root rows on 2 sort columns', function () {
        sortColumnCollection.sort({property: 'lastName'});
        sortColumnCollection.sort({property: 'firstName'});

        let rows = sortedRowCollection.items;
        expect(rows[0].lastName).toBe('de smedt');
        expect(rows[1].lastName).toBe('ze smedt');
        expect(rows[2].lastName).toBe('tree');
    });

    it('sorts the child rows too', function () {
        sortColumnCollection.sort({property: 'firstName'});

        let childRows = sortedRowCollection.items[2].processedChildren.items;
        expect(childRows[0].firstName).toBe('a');
        expect(childRows[1].firstName).toBe('b');
    });
});
