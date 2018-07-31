import FilteredRowCollection from '../../../src/collections/FilteredRowCollection';
import Row from '../../../src/models/Row';
import RowCollection from '../../../src/collections/RowCollection';
import SortColumnCollection from '../../../src/collections/SortColumnCollection';
import ColumnCollection from '../../../src/collections/ColumnCollection';
import Column from '../../../src/models/Column';

describe('FilteredRowCollection', () => {
    let filteredRowCollection;

    beforeEach(() => {
        const rowCollection = new RowCollection([
            new Row({
                firstName: 'table',
                lastName: 'tree',
                showChildren: true,
                children: [
                    new Row({
                        firstName: 'b',
                        lastName: 'null',
                    }),
                    new Row({
                        firstName: 'a',
                        lastName: 'something',
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

        const columnCollection = new ColumnCollection([
            new Column({
                property: 'firstName',
                filterable: true,
            }),
            new Column({
                property: 'lastName',
                filterable: true,
            }),
        ]);

        filteredRowCollection = new FilteredRowCollection(
            rowCollection,
            columnCollection
        );
    });

    it('filters all the root rows', function () {
        filteredRowCollection.filter = 'ar';

        let rows = filteredRowCollection.flatten();
        expect(rows.length).toBe(2);
        expect(rows[0].lastName).toBe('ze smedt');
        expect(rows[1].lastName).toBe('de smedt');
    });

    it('filters root and child rows', function () {
        filteredRowCollection.filter = 'a';

        let rows = filteredRowCollection.flatten();
        expect(rows.length).toBe(4);
        expect(rows[0].lastName).toBe('tree');
        expect(rows[1].lastName).toBe('something');
        expect(rows[2].lastName).toBe('ze smedt');
        expect(rows[3].lastName).toBe('de smedt');
    });

    it('use no filter return 6 rows', function () {
        filteredRowCollection.filter = '';

        let rows = filteredRowCollection.flatten();
        expect(rows.length).toBe(5);
    });
});
