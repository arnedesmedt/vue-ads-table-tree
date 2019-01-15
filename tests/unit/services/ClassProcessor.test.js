import ClassesProcessor from '../../../src/services/ClassProcessor';

describe('ClassProcessor', () => {
    let processor;

    beforeEach(() => {
        processor = new ClassesProcessor({}, 0);
        processor.totalRows = 5;
    });

    it('initializes the default params', () => {
        expect(processor.classes).toEqual({});
        expect(processor.totalColumns).toBe(0);
    });

    it('styles all rows', () => {
        processor.classes = {
            'all/': {
                test: true,
            },
        };

        expect(processor.processedClasses[0].rows).toEqual([
            0,
            1,
            2,
            3,
            4,
        ]);

        expect(processor.process(3)).toEqual({
            test: true,
        });
    });

    it('doesn\'t style rows out of range', () => {
        processor.classes = {
            'all/': {
                test: true,
            },
        };

        expect(processor.process(5)).toEqual({});
    });

    it('styles odd rows', () => {
        processor.classes = {
            'odd/': {
                test: true,
            },
        };

        expect(processor.processedClasses[0].rows).toEqual([
            1,
            3,
        ]);
    });

    it('styles even rows', () => {
        processor.classes = {
            'even/': {
                test: true,
            },
        };

        expect(processor.processedClasses[0].rows).toEqual([
            0,
            2,
            4,
        ]);
    });

    it('doesn\'t style any row if the total rows is not given', () => {
        processor = new ClassesProcessor({
            'even/': {
                test: true,
            },
        }, 0);

        expect(processor.processedClasses[0].rows).toEqual([]);
        expect(processor.process(0)).toEqual({});
    });

    it('styles a specific row range', () => {
        processor.classes = {
            '1_4/': {
                test: true,
            },
        };

        expect(processor.processedClasses[0].rows).toEqual([
            1,
            2,
            3,
        ]);
    });

    it('styles a some rows', () => {
        processor.classes = {
            '1,4/': {
                test: true,
            },
        };

        expect(processor.processedClasses[0].rows).toEqual([
            1,
            4,
        ]);
    });

    it('doesn\'t return a range if the start is lower than the end', function () {
        processor.classes = {
            '3_2/': {
                test: true,
            },
        };

        expect(processor.processedClasses[0].rows).toEqual([]);
    });

    it('doesn\'t return a range if the start and/or end are lower than 0', function () {
        processor.classes = {
            '-1_-2/': {
                test: true,
            },
        };

        expect(processor.processedClasses[0].rows).toEqual([]);
    });
});
