import { shallowMount } from '@vue/test-utils';

import TableTree from '../../../src/components/TableTree';

describe('TableTree', () => {
    let table;
    let rows;
    let columns;
    let columnA;
    let columnB;
    let columnC;

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

        columnA = {
            property: 'firstName',
            title: 'First Name',
        };

        columnB = {
            property: 'lastName',
            title: 'Last Name',
        };

        columnC = {
            property: 'age',
            title: 'Age',
        };

        columns = [
            columnA,
            columnB,
            columnC,
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
        expect(table.vm.displayFilter).toBeFalsy();
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
        columns[0].filterable = true;
        table = shallowMount(TableTree, {
            propsData: {
                columns,
            },
        });

        expect(table.vm.displayHeader).toBeTruthy();
        expect(table.vm.displayFilter).toBeTruthy();
    });

    it('adds the table classes', () => {
        table.setProps({
            classes: {
                table: {
                    test: true,
                },
            },
        });

        expect(table.vm.tableClasses).toEqual({
            test: true,
        });
    });

    it('adds the header row classes', () => {
        table.setProps({
            classes: {
                '0/': {
                    test: true,
                },
            },
        });

        expect(table.vm.headerRowClasses).toEqual({
            test: true,
        });
    });

    it('adds the info classes', () => {
        table.setProps({
            classes: {
                info: {
                    test: true,
                },
            },
        });

        expect(table.vm.infoClasses).toEqual({
            test: true,
        });
    });

    it('has no results if the rows property is empty', () => {
        table.setProps({
            rows: [],
        });

        expect(table.vm.hasNoResults).toBeTruthy();
    });

    it('has no rows if the rows property is not set', () => {
        table = shallowMount(TableTree, {
            propsData: {
                columns,
            },
        });

        expect(table.vm.flattenedRows).toHaveLength(0);
    });

    it('shows all rows without children or pagination', () => {
        expect(table.vm.flattenedRows).toHaveLength(3);
        expect(table.vm.flattenedRows.map(row => row.firstName)).toEqual([
            'Arne',
            'Bruno',
            'Kris',
        ]);
    });

    it('shows just the first 2 rows if the total rows per page is 2', () => {
        table.setData({
            start: 0,
            end: 2,
        });

        expect(table.vm.flattenedRows).toHaveLength(2);
        expect(table.vm.flattenedRows.map(row => row.firstName)).toEqual([
            'Arne',
            'Bruno',
        ]);
    });

    it('sorts the first column by desc', () => {
        columnA.direction = false;

        table = shallowMount(TableTree, {
            propsData: {
                rows,
                columns,
            },
        });

        table.vm.start = 0;
        table.vm.end = 10;

        expect(table.vm.flattenedRows.map(row => row.firstName)).toEqual([
            'Kris',
            'Bruno',
            'Arne',
        ]);
    });

    it('filters the based on the first column', () => {
        columnA.filterable = true;

        table = shallowMount(TableTree, {
            propsData: {
                rows,
                columns,
                filter: 'n',
            },
        });

        table.vm.start = 0;
        table.vm.end = 10;

        expect(table.vm.flattenedRows.map(row => row.firstName)).toEqual([
            'Arne',
            'Bruno',
        ]);
    });

    it('shows only the visible columns', () => {
        columnB.visible = false;

        table = shallowMount(TableTree, {
            propsData: {
                rows,
                columns,
                filter: 'n',
            },
        });

        expect(table.vm.visibleColumns.map(column => column.property)).toEqual([
            'firstName',
            'age',
        ]);
    });
});
