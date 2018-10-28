import {shallowMount} from '@vue/test-utils';

import Column from '../../../src/models/Column';
import Styling from '../../../src/models/Styling';
import HeaderCell from '../../../src/components/HeaderCell';

describe('HeaderCell', () => {
    let headerCell;
    let column;

    beforeEach(() => {
        column = new Column({
            property: 'firstName',
            _sortable: true,
        });
        headerCell = shallowMount(HeaderCell, {
            propsData: {
                styling: new Styling({
                    columnsAllExceptLast: 'vue-ads-table-tree-border-r',
                }),
                column: column,
                index: 0,
            },
        });
    });

    it('returns the default header classes', () => {
        expect(headerCell.vm.headerClasses).toEqual({
            'vue-ads-table-tree-border-r': true,
            'vue-ads-table-tree-w-auto': true,
        });
    });

    it('shows the sort icon if the column is sortable', () => {
        expect(headerCell.vm.sortIconClasses).toEqual({
            'vue-ads-table-tree-fa-sort': true,
            'vue-ads-table-tree-fa-sort-desc': false,
            'vue-ads-table-tree-fa-sort-asc': false,
        });
    });

    it('shows the desc sort icon if the column is desc sorted', () => {
        column = new Column({
            property: 'firstName',
            _sortable: true,
            direction: true,
        });

        headerCell.setProps({
            column: column,
        });

        expect(headerCell.vm.sortIconClasses).toEqual({
            'vue-ads-table-tree-fa-sort': false,
            'vue-ads-table-tree-fa-sort-desc': false,
            'vue-ads-table-tree-fa-sort-asc': true,
        });
    });

    it('shows the asc sort icon if the column is asc sorted', () => {
        column = new Column({
            property: 'firstName',
            _sortable: true,
            direction: false,
        });

        headerCell.setProps({
            column: column,
        });

        expect(headerCell.vm.sortIconClasses).toEqual({
            'vue-ads-table-tree-fa-sort': false,
            'vue-ads-table-tree-fa-sort-desc': true,
            'vue-ads-table-tree-fa-sort-asc': false,
        });
    });
});
