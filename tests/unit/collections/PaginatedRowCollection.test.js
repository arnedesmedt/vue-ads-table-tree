import Row from '../../../src/models/Row';
import RowCollection from '../../../src/collections/RowCollection';
import PaginatedRowCollection from '../../../src/collections/PaginatedRowCollection';

describe('PaginatedRowCollection', () => {
    let paginatedRowCollection;

    beforeEach(() => {
        const rowCollection = new RowCollection([
            new Row({
                firstName: '1',
            }),
            new Row({
                firstName: '2',
            }),
            new Row({
                firstName: '3',
            }),
            new Row({
                firstName: '4',
            }),
            new Row({
                firstName: '5',
            }),
            new Row({
                firstName: '6',
            }),
        ]);

        paginatedRowCollection = new PaginatedRowCollection(
            rowCollection
        );
    });

    it('paginates the first page', function () {
        paginatedRowCollection.range = {
            start: 0,
            end: 2,
        };

        let rows = paginatedRowCollection.items;
        expect(rows.length).toBe(2);
        expect(rows[0].firstName).toBe('1');
        expect(rows[1].firstName).toBe('2');
    });
});
