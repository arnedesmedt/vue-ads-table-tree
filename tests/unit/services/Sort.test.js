import ColumnCollection from '../../../src/collections/ColumnCollection';
import RowCollection from '../../../src/collections/RowCollection';
import Sort from '../../../src/services/Sort';

describe('Sort service', () => {
    let columnCollection;
    let rowCollection;
    let sort;

    beforeEach(() => {
        columnCollection = new ColumnCollection([
            {
                property: 'firstName',
                sortable: true,
            },
            {
                property: 'lastName',
                sortable: true,
            },
        ]);

        sort = new Sort(columnCollection);

        rowCollection = new RowCollection([
            {
                firstName: 'Bert',
                lastName: 'Desmedt',
            },
            {
                firstName: 'Arne',
                lastName: 'De Smedt',
                children: [
                    {
                        firstName: 'Leen',
                        lastName: 'Casteleyn',
                    },
                    {
                        firstName: 'Bieke',
                        lastName: 'Delft',
                    },
                ],
            },
            {
                firstName: 'Lieve',
                lastName: 'Vandermeer',
            },
            {
                firstName: 'Bert',
                lastName: 'Vanderplatse',
            },
        ]);
    });

    it('sorts the default rowCollection', () => {
        columnCollection.first.direction = true;
        let resultCollection = sort.sort(rowCollection);

        expect(resultCollection.first.firstName).toBe('Arne');
        expect(resultCollection.last.firstName).toBe('Lieve');
    });

    it('sorts the default rowCollection by desc', () => {
        columnCollection.first.direction = false;
        let resultCollection = sort.sort(rowCollection);

        expect(resultCollection.first.firstName).toBe('Lieve');
        expect(resultCollection.last.firstName).toBe('Arne');
    });

    it('checks if it has sorted columns', () => {
        columnCollection.first.direction = true;
        expect(sort.hasSortedColumns()).toBeTruthy();
    });

    it('checks if it has no sorted columns', () => {
        expect(sort.hasSortedColumns()).toBeFalsy();
    });
});
