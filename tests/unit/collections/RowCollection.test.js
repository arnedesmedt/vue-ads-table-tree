import RowCollection from '../../../src/collections/RowCollection';
import Row from '../../../src/models/Row';

describe('RowCollection', () => {
    it('adds all rows', function () {
        const rowCollection = new RowCollection([
            new Row(),
            new Row(),
        ]);

        expect(rowCollection.length).toBe(2);
    });

    it('maps all rows', function () {
        const rowCollection = new RowCollection([
            {},
            {},
        ]);

        expect(rowCollection.length).toBe(2);
        expect(rowCollection.items[0]).toBeInstanceOf(Row);
    });

    it('flattens the rows', function () {
        const rowCollection = new RowCollection([
            {
                name: 'arne',
                children: [
                    {
                        name: 'de smedt',
                    },
                ],
            },
            {
                name: 'table',
                showChildren: true,
                children: [
                    {
                        name: 'tree',
                    },
                ],
            },
        ]);

        const flattenedRowCollection = rowCollection.flatten();

        expect(flattenedRowCollection[0].name).toBe('arne');
        expect(flattenedRowCollection[1].name).toBe('table');
        expect(flattenedRowCollection[2].name).toBe('tree');
    });
});
