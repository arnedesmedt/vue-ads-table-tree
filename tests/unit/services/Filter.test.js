import ColumnCollection from '../../../src/collections/ColumnCollection';
import RowCollection from '../../../src/collections/RowCollection';
import Filter from '../../../src/services/Filter';

describe('Filter Service', () => {
    let columnCollection;
    let rowCollection;
    let filter;

    beforeEach(() => {
        columnCollection = new ColumnCollection([
            {
                property: 'firstName',
                filterable: true,
            },
            {
                property: 'lastName',
                filterable: true,
            },
        ]);

        filter = new Filter(columnCollection);

        rowCollection = new RowCollection([
            {
                firstName: 'Arne',
                lastName: 'De Smedt',
                children: [
                    {
                        firstName: 'Leen',
                        lastName: 'Casteleyn',
                    },
                ],
            },
            {
                firstName: 'Bert',
                lastName: 'Desmedt',
            },
            {
                firstName: 'Lieve',
                lastName: 'Vandermeer',
            },
            {
                firstName: 'Koen',
                lastName: 'Vanderplatse',
            },
        ]);
    });

    it('filters a rowCollection based on the default columnCollection', () => {
        filter.filterValue = 'van';
        let resultCollection = filter.filter(rowCollection);

        expect(resultCollection.items).toHaveLength(2);
        expect(resultCollection.first.firstName).toBe('Lieve');
    });

    it('filters nothing with an empty value', () => {
        expect(filter.filter(rowCollection)).toEqual(rowCollection);
    });

    it('disables a filter column', () => {
        columnCollection.items[1].filterable = false;

        filter.filterValue = 'van';

        expect(filter.filter(rowCollection).items).toHaveLength(0);
    });

    it('checks if the filtervalue is set', () => {
        filter.filterValue = 'van';

        expect(filter.isFiltering()).toBeTruthy();
    });

    it('check if the filterValue is not set', () => {
        expect(filter.isFiltering()).toBeFalsy();
    });

    it('also filters a parent if one of the children matches', () => {
        filter.filterValue = 'van';

        rowCollection.items[1].children = [
            {
                firstName: 'Janne',
                lastName: 'Vandebogaerde',
            },
        ];

        let resultCollection = filter.filter(rowCollection);

        expect(resultCollection.items).toHaveLength(3);
        expect(resultCollection.first.firstName).toBe('Bert');
    });
});
