import {shallowMount} from '@vue/test-utils';

import HeaderCell from '../../../src/components/HeaderCell';
import CSSProcessor from '../../../src/services/CSSProcessor';

describe('HeaderCell', () => {
    let headerCell;
    let cssProcessor;

    beforeEach(() => {
        cssProcessor = new CSSProcessor(2, {});
        cssProcessor.totalRows = 1;

        headerCell = shallowMount(HeaderCell, {
            propsData: {
                title: 'Title',
                columnIndex: 0,
                cssProcessor,
            },
        });
    });

    it('shows no sort icon if it\'s not sortable', () => {
        expect(headerCell.vm.sortIconClasses).toEqual({});
    });

    it('shows the sort icon if the column is sortable', () => {
        headerCell.setProps({
            sortable: true,
            direction: null,
        });

        expect(headerCell.vm.sortIconClasses['fa-sort']).toBeTruthy();
        expect(headerCell.vm.sortIconClasses['fa-sort-up']).toBeFalsy();
        expect(headerCell.vm.sortIconClasses['fa-sort-down']).toBeFalsy();
    });

    it('shows the desc sort icon if the column is desc sorted', () => {
        headerCell.setProps({
            sortable: true,
            direction: false,
        });

        expect(headerCell.vm.sortIconClasses['fa-sort']).toBeFalsy();
        expect(headerCell.vm.sortIconClasses['fa-sort-up']).toBeFalsy();
        expect(headerCell.vm.sortIconClasses['fa-sort-down']).toBeTruthy();
    });

    it('shows the asc sort icon if the column is asc sorted', () => {
        headerCell.setProps({
            sortable: true,
            direction: true,
        });

        expect(headerCell.vm.sortIconClasses['fa-sort']).toBeFalsy();
        expect(headerCell.vm.sortIconClasses['fa-sort-up']).toBeTruthy();
        expect(headerCell.vm.sortIconClasses['fa-sort-down']).toBeFalsy();
    });

    it('adds a cursor pointer if the column is sortable', () => {
        headerCell.setProps({
            sortable: true,
            direction: null,
        });

        expect(headerCell.vm.headerClasses).toEqual({
            'vue-ads-cursor-pointer': true,
        });
    });

    it('doesn\'t add a cursor pointer if the column is not sortable', () => {
        headerCell.setProps({
            sortable: false,
        });

        expect(headerCell.vm.headerClasses).toEqual({
            'vue-ads-cursor-pointer': false,
        });
    });

    it('returns the header classes with a column class', () => {
        cssProcessor = new CSSProcessor(2, {
            '/0': {
                test: true,
            },
        });
        cssProcessor.totalRows = 1;

        headerCell.setProps({
            cssProcessor,
        });

        expect(headerCell.vm.headerClasses).toEqual({
            'vue-ads-cursor-pointer': false,
            test: true,
        });
    });

    it('returns the header classes without a column class if they don\'t match', () => {
        cssProcessor = new CSSProcessor(2, {
            '/1': {
                test: true,
            },
        });
        cssProcessor.totalRows = 1;

        headerCell.setProps({
            cssProcessor,
        });

        expect(headerCell.vm.headerClasses).toEqual({
            'vue-ads-cursor-pointer': false,
        });
    });

    it('returns the header classes with a specific row class', () => {
        cssProcessor = new CSSProcessor(2, {
            '0/all': {
                test: true,
            },
        });
        cssProcessor.totalRows = 1;

        headerCell.setProps({
            cssProcessor,
        });

        expect(headerCell.vm.headerClasses).toEqual({
            'vue-ads-cursor-pointer': false,
            test: true,
        });
    });

    it('emits a sort event if the header cell is clicked', () => {
        headerCell.trigger('click');

        expect(headerCell.emitted().sort).toBeTruthy();
    });

    it('uses the toggle children icon slot if direction is null', () => {
        headerCell.setProps({
            sortable: true,
            direction: null,
            sortIconSlot: props => `Test ${props.direction === null ? 'null' : (props.direction ? 'true' : 'false')}`,
        });

        expect(headerCell.text()).toContain('Test null');
    });

    it('uses the toggle children icon slot if direction is true', () => {
        headerCell.setProps({
            sortable: true,
            direction: true,
            sortIconSlot: props => `Test ${props.direction === null ? 'null' : (props.direction ? 'true' : 'false')}`,
        });

        expect(headerCell.text()).toContain('Test true');
    });

    it('uses the toggle children icon slot if direction is false', () => {
        headerCell.setProps({
            sortable: true,
            direction: false,
            sortIconSlot: props => `Test ${props.direction === null ? 'null' : (props.direction ? 'true' : 'false')}`,
        });

        expect(headerCell.text()).toContain('Test false');
    });
});
