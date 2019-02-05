import { shallowMount } from '@vue/test-utils';

import Table from '../../../src/components/Table';

describe('Table', () => {
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
                age: 27,
            },
            {
                firstName: 'Tanja',
                lastName: 'Vandersyp',
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

        table = shallowMount(Table, {
            propsData: {
                rows,
                columns,
                start: 0,
                end: 10,
            },
        });
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
        expect(table.vm.infoClasses).toEqual({});
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

    it('has no results if the rows property is not set', () => {
        table = shallowMount(Table, {
            propsData: {
                columns,
                start: 0,
                end: 10,
            },
        });

        expect(table.vm.totalVisibleRows).toBe(0);
    });

    it('info is visible if loading is true', () => {
        table.setProps({
            loading: true,
        });

        expect(table.vm.infoVisible).toBeTruthy();
    });

    it('selects slots of the visible columns', () => {
        table = shallowMount(Table, {
            propsData: {
                rows,
                columns,
                start: 0,
                end: 10,
            },
            scopedSlots: {
                firstName: '<span slot-scope="props">test - {{ props.row.firstName}}</span>',
            },
        });

        expect(Object.keys(table.vm.rowSlots)).toEqual([
            'firstName',
        ]);
    });

    it('doesn\'t select slots of the invisible columns', () => {
        columnA.visible = false;
        table = shallowMount(Table, {
            propsData: {
                rows,
                columns,
                start: 0,
                end: 10,
            },
            scopedSlots: {
                firstName: '<span slot-scope="props">test - {{ props.row.firstName}}</span>',
                lastName: '<span slot-scope="props">test - {{ props.row.firstName}}</span>',
            },
        });

        expect(Object.keys(table.vm.rowSlots)).toEqual([
            'lastName',
        ]);
    });

    it('shows only the visible columns', () => {
        columnB.visible = false;

        table = shallowMount(Table, {
            propsData: {
                rows,
                columns,
            },
        });

        expect(table.vm.visibleColumns.map(column => column.property)).toEqual([
            'firstName',
            'age',
        ]);
    });

    it('shows all rows without children or pagination', () => {
        expect(table.vm.flattenedRows).toHaveLength(4);
        expect(table.vm.flattenedRows.map(row => row.firstName)).toEqual([
            'Arne',
            'Bruno',
            'Tanja',
            'Kris',
        ]);
    });

    it('shows just the first 2 rows if the total rows per page is 2', () => {
        table.setProps({
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

        table = shallowMount(Table, {
            propsData: {
                rows,
                columns,
            },
        });

        expect(table.vm.flattenedRows.map(row => row.firstName)).toEqual([
            'Tanja',
            'Kris',
            'Bruno',
            'Arne',
        ]);
    });

    it('sorts non string types', () => {
        columnC.direction = false;

        table = shallowMount(Table, {
            propsData: {
                rows,
                columns,
            },
        });

        expect(table.vm.flattenedRows.map(row => row.age)).toEqual([
            34,
            27,
            27,
            25,
        ]);
    });

    it('sorts child rows', () => {
        columnA.direction = true;

        rows[0]._showChildren = true;
        rows[0]._children = [
            {
                firstName: 'Bruno',
                lastName: 'Vandenhende',
                age: 25,
            },
            {
                firstName: 'Arne',
                lastName: 'Vanleem',
                age: 26,
            },
        ];

        table = shallowMount(Table, {
            propsData: {
                rows,
                columns,
            },
        });

        expect(table.vm.flattenedRows.map(row => row.firstName)).toEqual([
            'Arne',
            'Arne',
            'Bruno',
            'Bruno',
            'Kris',
            'Tanja',
        ]);
    });

    it('filters the table based on the first column', () => {
        columnA.filterable = true;

        table = shallowMount(Table, {
            propsData: {
                rows,
                columns,
                filter: 'n',
            },
        });

        expect(table.vm.flattenedRows.map(row => row.firstName)).toEqual([
            'Arne',
            'Bruno',
            'Tanja',
        ]);
    });

    it('filters child and parent if the parent doesn\'t match but only the child', () => {
        columnA.filterable = true;
        rows[0]._children = [
            {
                firstName: 'Bruno',
                lastName: 'Vandenhende',
                age: 25,
            },
        ];

        table = shallowMount(Table, {
            propsData: {
                rows,
                columns,
                filter: 'un',
            },
        });

        expect(table.vm.flattenedRows.map(row => row.firstName)).toEqual([
            'Arne',
            'Bruno',
            'Bruno',
        ]);
    });

    it('initializes columns without a property', () => {
        columns = [
            {
                title: 'Empty',
            },
            columnA,
            columnB,
        ];

        table = shallowMount(Table, {
            propsData: {
                rows,
                columns,
            },
        });

        expect(columns[0].property).toBe('');
    });

    it('initializes columns with an order but without a direction', () => {
        columnA.order = 1;

        table = shallowMount(Table, {
            propsData: {
                rows,
                columns,
            },
        });

        expect(columns[0].direction).toBeNull();
    });

    it('sorts a column and emits a sort event', () => {
        columnA.direction = null;

        table = shallowMount(Table, {
            propsData: {
                rows,
                columns,
            },
        });

        table.vm.sort(columnA);

        expect(table.emitted().sort).toBeTruthy();
        expect(columnA.direction).toBeTruthy();
        expect(columnA.order).toBe(1);
    });

    it('toggles the children', () => {
        rows[0]._showChildren = false;

        table = shallowMount(Table, {
            propsData: {
                rows,
                columns,
            },
        });

        table.vm.toggleChildren(rows[0]);

        expect(table.emitted()['toggle-children']).toBeTruthy();
        expect(rows[0]._showChildren).toBeTruthy();
    });

    it('temp rows are not filtered sorted or paginated', () => {
        columnA.direction = false;
        table = shallowMount(Table, {
            propsData: {
                rows,
                columns,
                filter: 'testje',
                temp: true,
                start: 0,
                end: 1,
            },
        });

        expect(table.vm.flattenedRows.map(row => row.firstName)).toEqual([
            'Arne',
            'Bruno',
            'Tanja',
            'Kris',
        ]);
    });

    it('doesn\'t filter rows with holes', () => {
        rows.length = 100;
        table = shallowMount(Table, {
            propsData: {
                rows,
                columns,
            },
        });

        expect(table.vm.filteredRows.length).toBe(100);
    });
});
