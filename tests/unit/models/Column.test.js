import Column from '../../../src/models/Column';

describe('Column model', () => {
    let column;

    beforeEach(() => {
        column = new Column({
            property: 'name',
        });
    });

    it('initializes the default values if no arguments are given', () => {
        expect(column.width).toBe('auto');
        expect(column.sortable).toBeFalsy();
        expect(column.direction).toBeNull();
        expect(column.filterable).toBeFalsy();
    });

    it('initializes the given values', () => {
        column = new Column({
            property: 'name',
            sortable: true,
            filterable: true,
            direction: false,
        });

        expect(column.sortable).toBeTruthy();
        expect(column.filterable).toBeTruthy();
        expect(column.direction).toBeFalsy();
    });

    it('throws an error if the direction is not true, false or null', () => {
        const columnThrow = () => {
            column.direction = 1;
        };

        expect(columnThrow).toThrow(Error);
    });

    it('throws an error if the column has no property attribute of the type string', () => {
        const columnThrow = () => {
            new Column();
        };

        expect(columnThrow).toThrow('Each column needs a unique property attribute of the type string');
    });

    it('changes the sort direction on a sort and sets the sortorder', () => {
        column.sort(1);

        expect(column.direction).toBeTruthy();
        expect(column.order).toBe(1);
    });
});
