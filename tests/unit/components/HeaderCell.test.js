import {shallowMount} from '@vue/test-utils';

import Column from '../../../src/models/Column';
import Border from '../../../src/models/Border';
import HeaderCell from '../../../src/components/HeaderCell';

describe('HeaderCell', () => {
    let headerCell;

    beforeEach(() => {
        headerCell = shallowMount(HeaderCell, {
            propsData: {
                border: new Border({
                    vertical: true,
                }),
                column: new Column({
                    property: 'firstName',
                }),
                index: 0,
            },
        });
    });

    it('returns the default header classes', function () {
        expect(headerCell.vm.headerClasses).toEqual({
            'border-r ': true,
            'w-auto': true,
        });
    });

    it('returns the default sort icon classes', function () {
        expect(headerCell.vm.sortIconClasses).toEqual({
            'fa-sort': false,
            'fa-sort-desc': false,
            'fa-sort-asc': false,
        });
    });

    it('shows the sort icon if the column is sortable', function () {
        headerCell.setProps({
            sortColumn: {
                direction: null,
            },
        });

        expect(headerCell.vm.sortIconClasses).toEqual({
            'fa-sort': true,
            'fa-sort-desc': false,
            'fa-sort-asc': false,
        });
    });

    it('shows the desc sort icon if the column is desc sorted', function () {
        headerCell.setProps({
            sortColumn: {
                direction: true,
            },
        });

        expect(headerCell.vm.sortIconClasses).toEqual({
            'fa-sort': false,
            'fa-sort-desc': false,
            'fa-sort-asc': true,
        });
    });

    it('shows the asc sort icon if the column is asc sorted', function () {
        headerCell.setProps({
            sortColumn: {
                direction: false,
            },
        });

        expect(headerCell.vm.sortIconClasses).toEqual({
            'fa-sort': false,
            'fa-sort-desc': true,
            'fa-sort-asc': false,
        });
    });
});
