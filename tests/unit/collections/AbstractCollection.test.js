import AbstractCollection from '../../../src/collections/AbstractCollection';

describe('AbstractCollection', () => {
    let abstractCollection;

    beforeEach(() => {
        abstractCollection = new AbstractCollection();
    });

    it('initializes no items if no argument is given', () => {
        expect(abstractCollection.items).toHaveLength(0);
    });

    it('can add items on a specific start index', () => {
        abstractCollection.push([1, 2], 5);

        expect(abstractCollection.length).toBe(7);
        expect(abstractCollection.items[5]).toBe(1);
        expect(abstractCollection.items[6]).toBe(2);
    });

    it('add one item at the end of the collection', () => {
        abstractCollection.push([1, 2], 5);
        abstractCollection.push(3);

        expect(abstractCollection.length).toBe(8);
        expect(abstractCollection.items[7]).toBe(3);
    });

    it('checks if all items are filled', () => {
        abstractCollection.push([1, 2], 0);

        expect(abstractCollection.filled()).toBeTruthy();
    });

    it('checks that not all items are filled', () => {
        abstractCollection.push([1, 2], 2);

        expect(abstractCollection.filled()).toBeFalsy();
    });

    it('checks if all items are filled in a range', () => {
        abstractCollection.push([1, 2], 5);

        expect(abstractCollection.filled(5, 7)).toBeTruthy();
    });

    it('checks that not all items are filled in a range', () => {
        abstractCollection.push([1, 2], 5);

        expect(abstractCollection.filled(6, 8)).toBeFalsy();
    });

    it('checks if all items are filled in a range when the range has a lenght of 0', () => {
        abstractCollection.push([1, 2], 5);

        expect(abstractCollection.filled(5, 5)).toBeTruthy();
    });

    it('extends the items array to a certain length', () => {
        abstractCollection.length = 5;

        expect(abstractCollection.items).toHaveLength(5);
        expect(abstractCollection.items[4]).toBeUndefined();
    });

    it('return the first element', () => {
        abstractCollection.push([1, 2], 0);

        expect(abstractCollection.first).toBe(1);
    });

    it('return the last element', () => {
        abstractCollection.push([1, 2], 0);

        expect(abstractCollection.last).toBe(2);
    });

    it('checks if the collection is empty', () => {
        expect(abstractCollection.empty()).toBeTruthy();
    });

    it('checks if the collection is not empty', () => {
        abstractCollection.push([0]);

        expect(abstractCollection.empty()).toBeFalsy();
    });

    it('checks if the collection is cleared', () => {
        abstractCollection.push([0]);

        expect(abstractCollection.length).toBe(1);

        abstractCollection.clear();

        expect(abstractCollection.empty()).toBeTruthy();
    });
});
