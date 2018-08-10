import Filter from '../../../src/services/Filter';
import Sort from '../../../src/services/Sort';
import Paginate from '../../../src/services/Paginate';
import Cache from '../../../src/services/Cache';
import RowCollection from '../../../src/collections/RowCollection';

jest.mock('../../../src/services/Filter', () => {
    return jest.fn().mockImplementation(() => {
        return {
            isFiltering: () => false,
        };
    });
});

jest.mock('../../../src/services/Sort', () => {
    return jest.fn().mockImplementation(() => {
        return {
            hasSortedColumns: () => false,
        };
    });
});

jest.mock('../../../src/services/Paginate', () => {
    return jest.fn().mockImplementation(() => {
        return {
            start: 5,
        };
    });
});

describe('Cache service', () => {
    let cache;
    let rowCollection;

    beforeEach(() => {
        rowCollection = new RowCollection();
        cache = new Cache(
            rowCollection,
            new Filter(),
            new Sort(),
            new Paginate(),
        );
    });

    it('caches the rowCollection while not filtering and sorting', () => {
        cache.store(new RowCollection([
            {
                name: 'Arne',
            },
        ]));

        expect(rowCollection.items).toHaveLength(6);
        expect(rowCollection.items[5].name).toBe('Arne');
    });

    it('doesn\'t caches the rowCollection while filtering', () => {
        Filter.mockImplementation(() => {
            return {
                isFiltering: () => true,
            };
        });

        cache.filterService = new Filter();

        cache.store(new RowCollection([
            {
                name: 'Arne',
            },
        ]));

        expect(rowCollection.items).toHaveLength(0);
    });
});
