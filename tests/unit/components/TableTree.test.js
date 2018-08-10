import { shallowMount } from '@vue/test-utils';

import TableTree from '../../../src/components/TableTree';

describe('BodyRow', () => {
    let tableTree;
    let rows;
    let asyncCall;

    beforeEach(() => {
        rows = [
            {
                firstName: 'Arnold',
                lastName: 'Smederij',
                address: 'btest',
            },
            {
                firstName: 'Peter',
                lastName: 'Janssens',
                address: 'ctest',
            },
            {
                firstName: 'Arne',
                lastName: 'De Smedt',
                address: 'ctest',
                children: [
                    {
                        firstName: 'Bob',
                        lastName: 'De Smedt',
                        address: 'ctest',
                    },
                    {
                        firstName: 'Alice',
                        lastName: 'De Smedt',
                        address: 'ctest',
                    },
                ],
            },
        ];

        asyncCall = (range, filter, sort, parent) => {

        };

        tableTree = shallowMount(TableTree, {
            propsData: {
                columns: [
                    {
                        property: 'firstName',
                        filterable: true,
                        sortable: true,
                    },
                    {
                        property: 'lastName',
                        filterable: true,
                    },
                    {
                        property: 'address',
                        sortable: true,
                    },
                ],
            },
        });
    });

    it('shows no results found if no rows are given', () => {
        expect(tableTree.text()).toEqual(expect.stringMatching(/No results found/));
    });

    it('show the children when toggled', async () => {
        tableTree.setProps({
            rows,
        });

        let lastRow = tableTree.vm.rowCollection.last;

        await tableTree.vm.pageChange(1, {start: 1, end: 3});
        tableTree.vm.renderRows();
        expect(tableTree.vm.visibleRowCollection.items).toHaveLength(2);
        await tableTree.vm.toggleChildren(lastRow);
        tableTree.vm.renderRows();
        expect(tableTree.vm.visibleRowCollection.items).toHaveLength(4);
    });

    it('filters the rows', async () => {
        tableTree.setProps({
            rows,
            filter: 'sme',
        });

        tableTree.vm.renderRows();

        expect(tableTree.vm.currentTotalRows).toBe(2);
    });

    it('resets the pagination when filtering', async () => {
        tableTree.setProps({
            rows,
            itemsPerPage: 1,
            page: 1,
        });

        expect(tableTree.vm.currentPage).toBe(1);

        tableTree.setProps({
            filter: 'sme',
        });

        expect(tableTree.vm.currentPage).toBe(0);
    });

    it('sorts the rows and childrows', async () => {
        tableTree.setProps({
            rows,
        });

        let lastRow = tableTree.vm.rowCollection.last;
        let firstColumn = tableTree.vm.columnCollection.first;

        await tableTree.vm.pageChange(0, {start: 0, end: 2});
        await tableTree.vm.toggleChildren(lastRow);
        tableTree.vm.renderRows();

        expect(tableTree.vm.visibleRowCollection.first.firstName).toBe('Arnold');

        await tableTree.vm.sortColumn(firstColumn);
        tableTree.vm.renderRows();

        expect(tableTree.vm.visibleRowCollection.first.firstName).toBe('Arne');
        expect(tableTree.vm.visibleRowCollection.items[1].firstName).toBe('Alice');
    });

    it('updates the rows and columns', () => {
        tableTree.setProps({
            rows,
        });

        expect(tableTree.vm.rowCollection.first.firstName).toBe('Arne');

        tableTree.setProps({
            columns: [
                {
                    property: 'animal',
                },
                {
                    property: 'type',
                },
            ],
            rows: [
                {
                    animal: 'salmon',
                    type: 'fish',
                },
                {
                    animal: 'parrot',
                    type: 'bird',
                },
            ],
        });

        expect(tableTree.vm.rowCollection.first.animal).toBe('salmon');
    });

    it('updates the border and background', () => {
        expect(tableTree.vm.borderModel.vertical).toBeTruthy();

        tableTree.setProps({
            border: {
                vertical: false,
                horizontal: false,
                outline: false,
            },
            background: {
                odd: false,
                even: false,
                hover: false,
            },
        });

        expect(tableTree.vm.borderModel.vertical).toBeFalsy();
    });
});
