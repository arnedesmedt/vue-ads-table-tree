import Column from '../../../src/models/Column';

describe('Column model', () => {
    let column;

    beforeEach(() => {
        column = new Column({
            property: 'name',
        });
    });

    it('initializes the default values if no arguments are given', () => {
        let column = new Column();
        expect(column.sortable).toBeFalsy();
        expect(column.direction).toBeNull();
        expect(column.filterable).toBeFalsy();
        expect(column.order).toBe(0);
        expect(column.property).toBe('');
        expect(column.collapseIcon).toBeFalsy();
    });

    it('initializes the given values', () => {
        column = new Column({
            property: 'name',
            sortable: true,
            filterable: true,
            direction: false,
            collapseIcon: true,
        });

        expect(column.sortable).toBeTruthy();
        expect(column.filterable).toBeTruthy();
        expect(column.direction).toBeFalsy();
        expect(column.collapseIcon).toBeTruthy();
        expect(column.property).toBe('name');
    });

    it('changes the sort direction on a sort and sets the sortorder', () => {
        column.sort(1);

        expect(column.direction).toBeTruthy();
        expect(column.order).toBe(1);
    });

    it('trhows an error if the direction is not null, false or true', () => {
        const test = () => {
            column.direction = 'test';
        };

        expect(test).toThrow('Sort direction has to be true (asc), false (desc) or null (no sorting)');
    });
});
