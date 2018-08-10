import AbstractCollection from '../../../src/collections/AbstractCollection';

describe('AbstractCollection', () => {
    let abstractCollection;

    beforeEach(() => {
        abstractCollection = new AbstractCollection();
    });

    it('initializes no items if no argument is given', () => {
        expect(abstractCollection.items).toHaveLength(0);
    });

    it('throws an error if new items are not in an array', () => {
        abstractCollection = () => new AbstractCollection(1);

        expect(abstractCollection).toThrow('Items has to be an Array, if you want to add items to a collection. \'number\' given.');
    });

    it('can add items on a specific start index', () => {
        abstractCollection.addItemsFromIndex([1, 2], 5);

        expect(abstractCollection.length).toBe(7);
        expect(abstractCollection.items[5]).toBe(1);
        expect(abstractCollection.items[6]).toBe(2);
    });

    it('add one item at the end of the collection', () => {
        abstractCollection.addItemsFromIndex([1, 2], 5);
        abstractCollection.addItemOnIndex(3);

        expect(abstractCollection.length).toBe(8);
        expect(abstractCollection.items[7]).toBe(3);
    });

    it('checks if all items are filled', () => {
        abstractCollection.addItemsFromIndex([1, 2], 0);

        expect(abstractCollection.allItemsAreFilled()).toBeTruthy();
    });

    it('checks that not all items are filled', () => {
        abstractCollection.addItemsFromIndex([1, 2], 2);

        expect(abstractCollection.allItemsAreFilled()).toBeFalsy();
    });

    it('checks if all items are filled in a range', () => {
        abstractCollection.addItemsFromIndex([1, 2], 5);

        expect(abstractCollection.allItemsAreFilledInRange({start: 5, end: 7})).toBeTruthy();
    });

    it('checks that not all items are filled in a range', () => {
        abstractCollection.addItemsFromIndex([1, 2], 5);

        expect(abstractCollection.allItemsAreFilledInRange({start: 6, end: 8})).toBeFalsy();
    });

    it('checks if all items are filled in a range when the range has a lenght of 0', () => {
        abstractCollection.addItemsFromIndex([1, 2], 5);

        expect(abstractCollection.allItemsAreFilledInRange({start: 5, end: 5})).toBeTruthy();
    });

    it('extends the items array to a certain length', () => {
        abstractCollection.extendToLength(5);

        expect(abstractCollection.items).toHaveLength(5);
        expect(abstractCollection.items[4]).toBeUndefined();
    });

    it('return the first element', () => {
        abstractCollection.addItemsFromIndex([1, 2], 0);

        expect(abstractCollection.first).toBe(1);
    });

    it('return the last element', () => {
        abstractCollection.addItemsFromIndex([1, 2], 0);

        expect(abstractCollection.last).toBe(2);
    });
});
