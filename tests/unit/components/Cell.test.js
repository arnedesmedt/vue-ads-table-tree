import { shallowMount } from '@vue/test-utils';

import Cell from '../../../src/components/Cell';
import CSSProcessor from '../../../src/services/CSSProcessor';

describe('Cell', () => {
    let cell;
    let row;
    let cssProcessor;
    let column;

    beforeEach(() => {
        row = {
            firstName: 'arne',
            _meta: {
                parent: 0,
            },
        };

        column = {
            property: 'firstName',

        };

        cssProcessor = new CSSProcessor(2, {});
        cssProcessor.totalRows = 1;

        cell = shallowMount(Cell, {
            propsData: {
                row,
                column,
                rowIndex: 0,
                columnIndex: 0,
                cssProcessor,
            },
        });
    });

    it('returns the default cell classes', () => {
        expect(cell.vm.cellClasses).toEqual({
            'vue-ads-px-4': true,
            'vue-ads-py-2': true,
            'vue-ads-text-sm': true,
        });
    });

    it('returns the cell classes with a specific column class', () => {
        cssProcessor = new CSSProcessor(2, {
            '/0': {
                test: true,
            },
        });
        cssProcessor.totalRows = 1;

        cell.setProps({
            cssProcessor,
        });

        expect(cell.vm.cellClasses).toEqual({
            'vue-ads-px-4': true,
            'vue-ads-py-2': true,
            'vue-ads-text-sm': true,
            test: true,
        });
    });

    it('only returns the default classes if the column class doesn\'t match', () => {
        cssProcessor = new CSSProcessor(2, {
            '/1': {
                test: true,
            },
        });
        cssProcessor.totalRows = 1;

        cell.setProps({
            cssProcessor,
        });

        expect(cell.vm.cellClasses).toEqual({
            'vue-ads-px-4': true,
            'vue-ads-py-2': true,
            'vue-ads-text-sm': true,
        });
    });

    it('returns the cell classes with a specific cell class', () => {
        cssProcessor = new CSSProcessor(2, {
            '1/0': {
                test: true,
            },
        });
        cssProcessor.totalRows = 1;

        cell.setProps({
            cssProcessor,
        });

        expect(cell.vm.cellClasses).toEqual({
            'vue-ads-px-4': true,
            'vue-ads-py-2': true,
            'vue-ads-text-sm': true,
            test: true,
        });
    });

    it('only returns the default classes if the cell class doesn\'t match', () => {
        cssProcessor = new CSSProcessor(2, {
            '1/1': {
                test: true,
            },
        });
        cssProcessor.totalRows = 1;

        cell.setProps({
            cssProcessor,
        });

        expect(cell.vm.cellClasses).toEqual({
            'vue-ads-px-4': true,
            'vue-ads-py-2': true,
            'vue-ads-text-sm': true,
        });
    });

    it('returns the cell classes with fixed row classes', () => {
        cell.setProps({
            row: {
                _classes: {
                    0: {
                        test: true,
                    },
                },
                firstName: 'arne',
                _meta: {
                    parent: 0,
                },
            },
        });

        expect(cell.vm.cellClasses).toEqual({
            'vue-ads-px-4': true,
            'vue-ads-py-2': true,
            'vue-ads-text-sm': true,
            test: true,
        });
    });

    it('only returns the default cell classes if the column doesn\'t match the fixed row classes', () => {
        cell.setProps({
            row: {
                _classes: {
                    1: {
                        test: true,
                    },
                },
                firstName: 'arne',
                _meta: {
                    parent: 0,
                },
            },
        });

        expect(cell.vm.cellClasses).toEqual({
            'vue-ads-px-4': true,
            'vue-ads-py-2': true,
            'vue-ads-text-sm': true,
        });
    });

    it('changes the padding if the number of parents changes', () => {
        cell.setProps({
            row: {
                firstName: 'arne',
                _hasChildren: false,
                _meta: {
                    parent: 1,
                    visibleChildren: [],
                },
            },
            column: {
                collapseIcon: true,
            },
        });

        expect(cell.vm.style['padding-left']).toBe('2.5rem');
    });

    it('doesn\'t add padding if the cell has no collapse icon', () => {
        cell.setProps({
            row: {
                firstName: 'arne',
                _meta: {
                    parent: 1,
                },
            },
            column: {
                collapseIcon: false,
            },
        });

        expect(cell.vm.style['padding-left']).toBe('1rem');
    });

    it('adds a toggle children button if the row has children and the column owns the button', () => {
        cell.setProps({
            row: {
                firstName: 'arne',
                _hasChildren: true,
                _meta: {
                    parent: 0,
                    visibleChildren: [],
                },
            },
            column: {
                property: 'firstName',
                collapseIcon: true,
            },
        });

        expect(cell.html()).toContain('<vueadschildrenbutton-stub></vueadschildrenbutton-stub>');
    });

    it('creates a column slot', () => {
        cell.setProps({
            columnSlot: props => {
                return `Test: ${props.row.firstName}`;
            },
        });

        expect(cell.text()).toBe('Test: arne');
    });

    it('is empty with no matching properties', () => {
        cell.setProps({
            row: {
                lastName: 'de smedt',
                _meta: {
                    parent: 0,
                },
            },
        });

        expect(cell.text()).toBe('');
    });

    it('emits toggle children, when calling toggle children', () => {
        cell.vm.toggleChildren();

        expect(cell.emitted().toggleChildren).toBeTruthy();
    });
});
