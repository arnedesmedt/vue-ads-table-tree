import Styling from '../../../src/models/Styling';

describe('Styling model', () => {
    it('initializes the default values if no values are given', () => {
        const styling = new Styling();

        expect(styling.rowsEven).toBe('bg-grey-lightest');
        expect(styling.rowsOdd).toBe('bg-white');
        expect(styling.rowsAll).toBe('hover:bg-grey-lighter');
        expect(styling.rowsAllExceptLast).toBe('border-b');
        expect(styling.columnsEven).toBe('');
        expect(styling.columnsOdd).toBe('');
        expect(styling.columnsAll).toBe('');
        expect(styling.columnsAllExceptLast).toBe('border-r');
        expect(styling.table).toBe('border');
    });

    it('initializes the given stylings if set', () => {
        const styling = new Styling({
            rowsEven: 'bg-red',
            rowsOdd: 'bg-blue',
            rowsAll: 'hover:bg-green',
            rowsAllExceptLast: 'border',
            columnsEven: 'bg-red',
            columnsOdd: 'bg-blue',
            columnsAll: 'hover:bg-green',
            columnsAllExceptLast: 'border',
            table: 'bg-yellow',
        });

        expect(styling.rowsEven).toBe('bg-red');
        expect(styling.rowsOdd).toBe('bg-blue');
        expect(styling.rowsAll).toBe('hover:bg-green');
        expect(styling.rowsAllExceptLast).toBe('border');
        expect(styling.columnsEven).toBe('bg-red');
        expect(styling.columnsOdd).toBe('bg-blue');
        expect(styling.columnsAll).toBe('hover:bg-green');
        expect(styling.columnsAllExceptLast).toBe('border');
        expect(styling.table).toBe('bg-yellow');
    });

    it('returns the correct row classes if the row index is given', () => {
        const styling = new Styling();

        expect(styling.rowClasses(0)).toEqual({
            'bg-grey-lightest': true,
            'hover:bg-grey-lighter': true,
            'border-b': true,
        });
        expect(styling.rowClasses(1, true)).toEqual({
            'bg-white': true,
            'hover:bg-grey-lighter': true,
        });
    });

    it('returns the correct column classes if the column index is given', () => {
        const styling = new Styling({
            columnsOdd: 'bg-red',
            columnsEven: 'bg-green',
            columnsAll: 'hover:bg-yellow',
        });

        expect(styling.columnClasses(0)).toEqual({
            'bg-green': true,
            'hover:bg-yellow': true,
            'border-r': true,
        });
        expect(styling.columnClasses(1, true)).toEqual({
            'bg-red': true,
            'hover:bg-yellow': true,
        });
    });

    it('throws an error if the style is not an object', function () {
        expect(() => {
            const styling = new Styling(1);
        }).toThrow(
            'Styling first argument has to be an object with the properties rowsEven, rowsOdd, rowsAll, ' +
            'rowsExceptLast, columnsEven, columnsOdd, columnsAll, columnsExceptLast and/or table. \'number\' given'
        );
    });
});
