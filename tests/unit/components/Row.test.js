import { shallowMount } from '@vue/test-utils';

import Row from '../../../src/components/Row';
import CSSProcessor from '../../../src/services/CSSProcessor';

describe('Row', () => {
    let row;
    let columnA;
    let columnB;
    let cssProcessor;


    beforeEach(() => {
        columnA = {
            property: 'firstName',
        };
        columnB = {
            property: 'lastName',
        };

        cssProcessor = new CSSProcessor(2, {});
        cssProcessor.totalRows = 1;

        row = shallowMount(Row, {
            propsData: {
                row: {
                    firstName: 'Arne',
                    lastName: 'De Smedt',
                },
                columns: [
                    columnA,
                    columnB,
                ],
                rowIndex: 0,
                cssProcessor,
            },
        });
    });

    it('generates classes via the row index', () => {
        cssProcessor = new CSSProcessor(2, {
            '1/': {
                test: true,
            },
        });
        cssProcessor.totalRows = 1;

        row.setProps({
            cssProcessor,
        });

        expect(row.vm.rowClasses).toEqual({
            test: true,
        });
    });

    it('generates classes via the fixed row classes attribute', () => {
        row.setProps({
            row: {
                firstName: 'Arne',
                lastName: 'De Smedt',
                _classes: {
                    row: {
                        test: true,
                    },
                },
            },
        });

        expect(row.vm.rowClasses).toEqual({
            test: true,
        });
    });

    it('selects the correct column slot', () => {
        row.setProps({
            slots: {
                firstName: 'test',
                lastName: 'test2',
            },
        });

        expect(row.vm.columnSlot(columnA)).toBe('test');
    });

    it('selects the correct cell slot', () => {
        row.setProps({
            slots: {
                firstName_Arne: 'testcell',
                firstName: 'test',
            },
        });

        expect(row.vm.columnSlot(columnA)).toBe('testcell');
    });
});
