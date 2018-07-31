import Background from '../../../src/models/Background';

describe('Background model', () => {
    it('initializes the default values if no values are given', function () {
        const background = new Background();

        expect(background.even).toBe('grey-lightest');
        expect(background.odd).toBe('white');
        expect(background.hover).toBe('grey-lighter');
    });

    it('initializes the given background colors if set', function () {
        const background = new Background ({
            even: 'red',
            odd: 'blue',
            hover: 'green',
        });

        expect(background.even).toBe('red');
        expect(background.odd).toBe('blue');
        expect(background.hover).toBe('green');
    });

    it('returns the correct background class if the row index is even', function () {
        const background = new Background();

        expect(background.classes(0)).toEqual({
            'bg-grey-lightest': true,
            'hover:bg-grey-lighter': true,
        });
        expect(background.classes(1)).toEqual({
            'bg-white': true,
            'hover:bg-grey-lighter': true,
        });
    });

    it('don\'t add a any class, if all set to false', function () {
        const background = new Background({
            even: false,
            odd: false,
            hover: false,
        });

        expect(background.classes(0)).toEqual({});
    });

    it('throws an error if the background argument is not an object', function () {
        const background = () => {new Background(1)};

        expect(background).toThrow(Error);
    });
});
