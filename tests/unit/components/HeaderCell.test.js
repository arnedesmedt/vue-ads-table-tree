import {shallowMount} from '@vue/test-utils';

import HeaderCell from '../../../src/components/HeaderCell';
import ClassesProcessor from '../../../src/services/ClassProcessor';

describe('HeaderCell', () => {
    let headerCell;

    beforeEach(() => {
        headerCell = shallowMount(HeaderCell, {
            propsData: {
                title: 'Title',
                classes: new ClassesProcessor({}, 0),
            },
        });
    });

    it('shows no sort icon if it\'s not sortable', () => {
        headerCell.setProps({
            sortable: false,
        });

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
});
