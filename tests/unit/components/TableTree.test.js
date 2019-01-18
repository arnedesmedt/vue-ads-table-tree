import { shallowMount, mount } from '@vue/test-utils';

import TableTree from '../../../src/components/TableTree';

describe('TableTree', () => {
    let table;
    let rows;
    let columns;

    beforeEach(() => {
        rows = [
            {
                firstName: 'Arne',
                lastName: 'De Smedt',
                age: 27,
            },
            {
                firstName: 'Bruno',
                lastName: 'Vandenhende',
                age: 25,
            },
            {
                firstName: 'Kris',
                lastName: 'Dejagere',
                age: 34,
            },
        ];
        columns = [
            {
                property: 'firstName',
                title: 'First Name',
            },
            {
                property: 'lastName',
                title: 'Last Name',
            },
            {
                property: 'age',
                title: 'Age',
            },
        ];

        table = shallowMount(TableTree, {
            propsData: {
                rows,
                columns,
            },
        });

        table.vm.start = 0;
        table.vm.end = 10;
    });

    it('has no header if no title slot or filter columns exist', () => {
        expect(table.vm.displayHeader).toBeFalsy();
    });

    it('has a header if a title slot exist', () => {
        table = shallowMount(TableTree, {
            propsData: {
                columns,
            },

            slots: {
                title: '<div>test</div>',
            },
        });

        expect(table.vm.displayHeader).toBeTruthy();
    });

    it('has a header if one column is filterable', () => {
        columns.
        table = shallowMount(TableTree, {
            propsData: {
                columns,
            },
        });

        expect(table.vm.displayHeader).toBeTruthy();
    });



    it('has no visible rows if the rows property is not set', () => {
        table = shallowMount(TableTree, {
            propsData: {
                columns,
            },
        });

        expect(table.vm.visibleRows).toHaveLength(0);
    });

    it('shows all visible rows without children or pagination', () => {
        expect(table.vm.visibleRows).toHaveLength(3);
        expect(table.vm.visibleRows.map(row => row.properties.firstName)).toEqual([
            'Arne',
            'Bruno',
            'Kris',
        ]);
    });

    it('shows all visible rows without children or pagination', () => {
        expect(table.vm.visibleRows).toHaveLength(3);
        expect(table.vm.visibleRows.map(row => row.properties.firstName)).toEqual([
            'Arne',
            'Bruno',
            'Kris',
        ]);
    });
});
