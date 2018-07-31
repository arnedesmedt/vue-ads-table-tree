import Column from '../../../src/models/Column';

describe('Column model', () => {
    it('initializes the default values if no arguments are given', function () {
        const column = new Column();

        expect(column.width).toBe('auto');
        expect(column.sortable).toBeFalsy();
        expect(column.direction).toBeNull();
        expect(column.filterable).toBeFalsy();
    });

    it('throws an error if the direction is not true, false or null', function () {
        const column = () => {
            new Column({
                direction: 1,
            });
        };

        expect(column).toThrow(Error);
    });
});
