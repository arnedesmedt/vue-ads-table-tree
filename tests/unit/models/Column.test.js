import Column from '../../../src/models/Column';

describe('Column model', () => {
    it('initializes the default values if no arguments are given', function () {
        const column = new Column({
            property: 'name',
        });

        expect(column.width).toBe('auto');
        expect(column.sortable).toBeFalsy();
        expect(column.direction).toBeNull();
        expect(column.filterable).toBeFalsy();
    });

    it('throws an error if the direction is not true, false or null', function () {
        const column = () => {
            new Column({
                property: 'name',
                direction: 1,
            });
        };

        expect(column).toThrow(Error);
    });

    it('throws an error if the column has no property attribute of the type string', function () {
        const column = () => {
            new Column();
        };

        expect(column).toThrow('Each column needs a unique property attribute of the type string');
    });
});
