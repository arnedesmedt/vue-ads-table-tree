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

        expect(headerCell.vm.sortIconClasses).toEqual({
            'fa-sort': true,
            'fa-sort-up': false,
            'fa-sort-down': false,
        });
    });

    it('shows the desc sort icon if the column is desc sorted', () => {
        headerCell.setProps({
            sortable: true,
            direction: false,
        });

        expect(headerCell.vm.sortIconClasses).toEqual({
            'fa-sort': false,
            'fa-sort-up': false,
            'fa-sort-down': true,
        });
    });

    it('shows the asc sort icon if the column is asc sorted', () => {
        headerCell.setProps({
            sortable: true,
            direction: true,
        });

        expect(headerCell.vm.sortIconClasses).toEqual({
            'fa-sort': false,
            'fa-sort-up': true,
            'fa-sort-down': false,
        });
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
});
