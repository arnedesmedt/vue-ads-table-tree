import ColumnCollection from '../../../src/collections/ColumnCollection';
import Column from '../../../src/models/Column';

describe('ColumnCollection', () => {
    let columnCollection;

    beforeEach(() => {
        columnCollection = new ColumnCollection([
            {
                property: 'firstName',
            },
            {
                property: 'lastName',
            }
        ]);
    });


    it('maps all columns', () => {
        expect(columnCollection.length).toBe(2);
        expect(columnCollection.first).toBeInstanceOf(Column);
    });

    it('returns all column properties', () => {
        expect(columnCollection.properties).toEqual(['firstName', 'lastName']);
    });

    it('returns the filterValue columns', () => {
        columnCollection.first.filterable = true;

        expect(columnCollection.filterColumnNames).toEqual(['firstName']);
    });

    it('returns the sortable columns', () => {
        columnCollection.last.sortable = true;

        expect(columnCollection.sortableColumns()[0]).toBeInstanceOf(Column);
        expect(columnCollection.sortableColumns()[0].property).toBe('lastName');
    });

    it('returns 0 as maxSortOrder if no column is sortable', () => {
        columnCollection.first.order = 6;
        columnCollection.last.order = 8;

        expect(columnCollection.maxOrder()).toBe(0);
    });

    it('returns 0 as maxSortOrder if no sort direction is set', () => {
        columnCollection.first.order = 6;
        columnCollection.first.sortable = true;
        columnCollection.last.order = 8;
        columnCollection.last.sortable = true;

        expect(columnCollection.maxOrder()).toBe(0);
    });

    it('returns the heighest sort order for maxSortOrder', () => {
        columnCollection.first.order = 6;
        columnCollection.first.sortable = true;
        columnCollection.first.direction = true;
        columnCollection.last.order = 8;
        columnCollection.last.sortable = true;
        columnCollection.last.direction = true;

        expect(columnCollection.maxOrder()).toBe(8);
    });

    it('sorts on a specific column', () => {
        columnCollection.first.sortable = true;
        columnCollection.sort(columnCollection.first);

        expect(columnCollection.first.order).toBe(1);
    });

    it('sorts the columns desc if they are sorting', () => {
        columnCollection.first.sortable = true;
        columnCollection.last.sortable = true;

        columnCollection.sort(columnCollection.last);
        columnCollection.sort(columnCollection.first);

        expect(columnCollection.last.order).toBe(1);
        expect(columnCollection.first.order).toBe(2);
    });

    it('checks if their are no filter columns ', () => {
        expect(columnCollection.hasFilterColumns()).toBeFalsy();
    });

    it('checks if their are filter columns ', () => {
        columnCollection.first.filterable = true;

        expect(columnCollection.hasFilterColumns()).toBeTruthy();
    });
});
