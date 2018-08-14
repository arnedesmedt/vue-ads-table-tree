import Paginate from '../../../src/services/Paginate';
import RowCollection from '../../../src/collections/RowCollection';

describe('Paginate service', () => {
    let paginate;
    let rowCollection;

    beforeEach(() => {
        paginate = new Paginate();
        rowCollection = new RowCollection([
            {
                name: 'a',
            },
            {
                name: 'b',
            },
            {
                name: 'c',
            },
            {
                name: 'd',
            },
            {
                name: 'e',
            },
            {
                name: 'f',
            },
            {
                name: 'g',
            },
        ]);
    });

    it('paginates the rowCollection', () => {
        paginate.range = {
            start: 4,
            end: 6,
        };

        let resultCollection = paginate.paginate(rowCollection);

        expect(resultCollection.items).toHaveLength(2);
        expect(resultCollection.items[0].name).toBe('e');
        expect(resultCollection.items[1].name).toBe('f');
    });
});
