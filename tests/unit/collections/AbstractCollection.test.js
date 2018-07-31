import AbstractCollection from '../../../src/collections/AbstractCollection';

describe('AbstractCollection', () => {
    it('throws an error if new items are not in an array', function () {
        const abstractCollection = () => new AbstractCollection(1);

        expect(abstractCollection).toThrow('Items has to be an Array, if you want to add items to a collection. \'number\' given.');
    });

    it('can add items on a specific start index', function () {
        const abstractCollection = new AbstractCollection([]);
        abstractCollection.addItemsFromIndex([1, 2], 5);

        expect(abstractCollection.length).toBe(7);
        expect(abstractCollection.items[5]).toBe(1);
        expect(abstractCollection.items[6]).toBe(2);
    });

    it('add one item at the end of the collection', function () {
        const abstractCollection = new AbstractCollection([]);
        abstractCollection.addItemsFromIndex([1, 2], 5);
        abstractCollection.addItemOnIndex(3);

        expect(abstractCollection.length).toBe(8);
        expect(abstractCollection.items[7]).toBe(3);
    });
});
