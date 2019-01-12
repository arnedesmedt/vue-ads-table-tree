import RowCollection from '../../../src/collections/RowCollection';
import Row from '../../../src/models/Row';
import Column from '../../../src/models/Column';

describe('RowCollection', () => {
    let rowCollection;

    beforeEach(() => {
        rowCollection = new RowCollection([
            {
                name: 'arne',
                showChildren: true,
                children: [
                    {
                        name: 'hanne',
                    },
                ],
            },
            {
                name: 'liese',
                showChildren: true,
                children: [
                    {
                        name: 'lien',
                    },
                ],
            },
        ]);
    });

    it('maps all rows', () => {
        expect(rowCollection.length).toBe(2);
        expect(rowCollection.first).toBeInstanceOf(Row);
    });

    it('flattens the rows', () => {
        const flattenedRowCollection = rowCollection.flatten().map(row => row.properties.name);

        expect(flattenedRowCollection).toEqual([
            'arne',
            'hanne',
            'liese',
            'lien',
        ]);
    });

    it('flattens rows without visible Children', () => {
        rowCollection.first.showChildren = false;
        rowCollection.last.showChildren = false;

        const flattenedRowCollection = rowCollection.flatten().map(row => row.properties.name);

        expect(flattenedRowCollection).toEqual([
            'arne',
            'liese',
        ]);

    });

    it('checks that all rows are loaded', () => {
        expect(rowCollection.fullyFilled(2)).toBeTruthy();
    });

    it('checks that not all rows are loaded', () => {
        rowCollection.push([
            {
                hasChildren: true,
            },
        ]);

        expect(rowCollection.fullyFilled(3)).toBeFalsy();
    });

    it('checks that all rows in a range are loaded', () => {
        rowCollection.length = 6;

        expect(rowCollection.filled(2, 0)).toBeTruthy();
    });

    it('checks that not all rows in a range are loaded', () => {
        rowCollection.length = 6;

        expect(rowCollection.filled(5, 0)).toBeFalsy();
    });

    it('filters nothing for an empty filter', () => {
        expect(rowCollection.filter(new RegExp(''), [
            'name',
        ]).flatten().length).toBe(4);
    });

    it('doesn\'t filter if their are no properties', () => {
        expect(rowCollection.filter(new RegExp('arne'), []).flatten().length).toBe(4);
    });

    it('filters the root rows', () => {
        const filteredCollection = rowCollection.filter(new RegExp('arne'), [
            'name',
        ]).flatten();

        expect(filteredCollection.length).toBe(2);
        expect(filteredCollection[0].properties.name).toBe('arne');
        expect(filteredCollection[1].properties.name).toBe('hanne');
    });

    it('filters the child rows', () => {
        const filteredCollection = rowCollection.filter(new RegExp('lien'), [
            'name',
        ]).flatten();

        expect(filteredCollection.length).toBe(2);
        expect(filteredCollection[0].properties.name).toBe('liese');
        expect(filteredCollection[1].properties.name).toBe('lien');
    });

    it('expand the child rows for a filter if it was collapsed', () => {
        rowCollection.last.showChildren = false;
        expect(rowCollection.flatten().length).toBe(3);

        const filteredCollection = rowCollection.filter(new RegExp('lien'), [
            'name',
        ]).flatten();

        expect(filteredCollection.length).toBe(2);
        expect(filteredCollection[0].properties.name).toBe('liese');
        expect(filteredCollection[1].properties.name).toBe('lien');
    });

    it('sorts nothing if no sort columns are defined', () => {
        expect(rowCollection.sort([]).flatten().map(row => row.properties.name)).toEqual([
            'arne',
            'hanne',
            'liese',
            'lien',
        ]);
    });

    it('sorts on name', () => {
        let result = rowCollection.sort([
            new Column({
                property: 'name',
                direction: true,
            }),
        ]);

        expect(result.flatten().map(row => row.properties.name)).toEqual([
            'arne',
            'hanne',
            'liese',
            'lien',
        ]);
    });

    it('sorts desc on name', () => {
        let result = rowCollection.sort([
            new Column({
                property: 'name',
                direction: false,
            }),
        ]);

        expect(result.flatten().map(row => row.properties.name)).toEqual([
            'liese',
            'lien',
            'arne',
            'hanne',
        ]);
    });

    it('sorts booleans', () => {
        rowCollection = new RowCollection([
            {
                id: 1,
                name: true,
            },
            {
                id: 2,
                name: false,
            },
            {
                id: 3,
                name: true,
            },
        ]);

        let result = rowCollection.sort([
            new Column({
                property: 'name',
                direction: true,
            }),
        ]);

        expect(result.flatten().map(row => row.properties.id)).toEqual([
            2,
            1,
            3,
        ]);
    });

    it('sorts integers', () => {
        rowCollection = new RowCollection([
            {
                id: 3,
            },
            {
                id: 1,
            },
            {
                id: 2,
            },
        ]);

        let result = rowCollection.sort([
            new Column({
                property: 'id',
                direction: true,
            }),
        ]);

        expect(result.flatten().map(row => row.properties.id)).toEqual([
            1,
            2,
            3,
        ]);
    });

    it('sorts children on name', () => {
        rowCollection = new RowCollection([
            {
                name: 'arne',
                showChildren: true,
                children: [
                    {
                        name: 'hanne',
                    },
                    {
                        name: 'lien',
                    },
                    {
                        name: 'liese',
                    },
                ],
            },
        ]);

        let result = rowCollection.sort([
            new Column({
                property: 'name',
                direction: true,
            }),
        ]);

        expect(result.flatten().map(row => row.properties.name)).toEqual([
            'arne',
            'hanne',
            'lien',
            'liese',
        ]);
    });

    it('sorts on multiple columns', () => {
        rowCollection = new RowCollection([
            {
                name: 'arne',
                lastName: 'de smedt',
            },
            {
                name: 'hanne',
                lastName: 'vandenhende',
            },
            {
                name: 'lien',
                lastName: 'vandenhende',
            },
            {
                name: 'liese',
                lastName: 'de smedt',
            },
        ]);

        let result = rowCollection
            .sort([
                new Column({
                    property: 'name',
                    direction: false,
                }),
            ])
            .sort([
                new Column({
                    property: 'lastName',
                    direction: false,
                }),
            ]);

        expect(result.flatten().map(row => row.properties.name)).toEqual([
            'lien',
            'hanne',
            'liese',
            'arne',
        ]);
    });

    it('paginates the rowCollection', () => {
        expect(rowCollection.paginate(0, 1).length).toBe(1);
    });

    it('initialzes the parent', () => {
        let parent = new Row();
        rowCollection.initParent(parent);

        rowCollection.items.forEach(row => {
            expect(row.parent === parent).toBeTruthy();
        });
    });
});
