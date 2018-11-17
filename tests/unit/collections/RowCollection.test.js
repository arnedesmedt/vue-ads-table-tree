import RowCollection from '../../../src/collections/RowCollection';
import Row from '../../../src/models/Row';

describe('RowCollection', () => {
    it('adds all rows', () => {
        const rowCollection = new RowCollection([
            new Row(),
            new Row(),
        ]);

        expect(rowCollection.length).toBe(2);
    });

    it('maps all rows', () => {
        const rowCollection = new RowCollection([
            {},
            {},
        ]);

        expect(rowCollection.length).toBe(2);
        expect(rowCollection.first).toBeInstanceOf(Row);
    });

    it('flattens the rows', () => {
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

    it('add rows to a specific index', () => {
        const rowCollection = new RowCollection();

        rowCollection.push([{}, {}], 1);

        expect(rowCollection.first).toBeUndefined();
        expect(rowCollection.length).toBe(3);
        expect(rowCollection.items[2]).toBeInstanceOf(Row);
    });

    it('checks that all rows are loaded', () => {
        const rowCollection = new RowCollection([
            {
                hasChildren: true,
                children: [
                    {},
                ],
            },
            {
                hasChildren: false,
            },
        ]);

        expect(rowCollection.fullyFilled(2)).toBeTruthy();
    });

    it('checks that not all rows are loaded', () => {
        const rowCollection = new RowCollection([
            {
                hasChildren: true,
                children: [
                    {},
                ],
            },
            {
                hasChildren: true,
            },
            {},
        ]);

        expect(rowCollection.fullyFilled(3)).toBeFalsy();
    });

    it('checks that not all rows are loaded', () => {
        const rowCollection = new RowCollection([
            {
                hasChildren: true,
                children: [
                    {},
                ],
            },
            {
                hasChildren: true,
            },
        ]);

        expect(rowCollection.fullyFilled(3)).toBeFalsy();
    });

    it('checks that all rows in a range are loaded', () => {
        const rowCollection = new RowCollection();
        rowCollection.length = 6;

        expect(rowCollection.allRowsInRangeLoaded({start: 0, end: 4})).toBeFalsy();
    });
});
