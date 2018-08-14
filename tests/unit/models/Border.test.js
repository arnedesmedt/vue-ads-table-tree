import Border from '../../../src/models/Border';

describe('Border model', () => {
    it('initializes the default values if no values are given', () => {
        const border = new Border();

        expect(border.horizontal).toBeTruthy();
        expect(border.vertical).toBeTruthy();
        expect(border.outline).toBeTruthy();
    });

    it('initializes the given borders if set', () => {
        const border = new Border({
            horizontal: false,
            vertical: false,
            outline: false,
        });

        expect(border.horizontal).toBeFalsy();
        expect(border.vertical).toBeFalsy();
        expect(border.outline).toBeFalsy();
    });

    it('returns an empty table class if no outline is set', () => {
        const border = new Border({
            outline: false,
        });

        expect(border.tableClasses()).toEqual({});
    });

    it('returns the default table class if outline is set to true', () => {
        const border = new Border({
            outline: true,
        });

        expect(border.tableClasses()).toEqual({
            'border ': true,
        });
    });

    it('returns an extended table class if outline is an extra border class', () => {
        const border = new Border({
            outline: 'border-dashed',
        });

        expect(border.tableClasses()).toEqual({
            'border border-dashed': true,
        });
    });

    it('returns an empty row class if no horizontal is set', () => {
        const border = new Border({
            horizontal: false,
        });

        expect(border.rowClasses()).toEqual({});
    });

    it('returns an empty row class if this is the last row', () => {
        const border = new Border({
            horizontal: true,
        });

        expect(border.rowClasses(true)).toEqual({});
    });

    it('returns the default row class if horizontal is set to true', () => {
        const border = new Border({
            horizontal: true,
        });

        expect(border.rowClasses()).toEqual({
            'border-b ': true,
        });
    });

    it('returns an extended row class if horizontal is an extra border class', () => {
        const border = new Border({
            horizontal: 'border-dashed',
        });

        expect(border.rowClasses()).toEqual({
            'border-b border-dashed': true,
        });
    });

    it('returns an empty column class if no vertical is set', () => {
        const border = new Border({
            vertical: false,
        });

        expect(border.columnClasses()).toEqual({});
    });

    it('returns an empty column class if this is the last column', () => {
        const border = new Border({
            vertical: true,
        });

        expect(border.columnClasses(true)).toEqual({});
    });

    it('returns the default column class if vertical is set to true', () => {
        const border = new Border({
            vertical: true,
        });

        expect(border.columnClasses()).toEqual({
            'border-r ': true,
        });
    });

    it('returns an extended column class if vertical is an extra border class', () => {
        const border = new Border({
            vertical: 'border-dashed',
        });

        expect(border.columnClasses()).toEqual({
            'border-r border-dashed': true,
        });
    });

    it('throws an error if the border argument is not an object', () => {
        const border = () => { new Border(1); };

        expect(border).toThrow(Error);
    });
});
