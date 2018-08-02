import { shallowMount } from '@vue/test-utils';

import TableTree from '../../../src/components/TableTree';

describe('BodyRow', () => {
    let tableTree;

    beforeEach(() => {
        tableTree = shallowMount(TableTree, {
            propsData: {
                columns: [
                    {
                        property: 'firstName',
                        filterable: true,
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
                rows: [
                    {
                        'firstName': 'arne',
                        'lastName': 'de smedt',
                        'address': 'ctest',
                    },
                    {
                        'firstName': 'arnold',
                        'lastName': 'smederij',
                        'address': 'btest',
                    },
                    {
                        'firstName': 'peter',
                        'lastName': 'janssens',
                        'address': 'ctest',
                    },
                ],
            },
        });
    });

    it('shows no results found if no rows are given', function () {
        const tableTree = shallowMount(TableTree, {
            propsData: {
                columns: [
                    {
                        property: 'firstName',
                        filterable: true,
                    },
                ],
            },
        });

        expect(tableTree.text()).toEqual(expect.stringMatching(/No results found/));
    });

    it('resets the pagination when filtering', function () {
        tableTree.setProps({
            itemsPerPage: 1,
            page: 1,
            filter: 'sme',
        });

        expect(tableTree.vm.currentPage).toBe(0);
    });

    it('updates the rows and columns', function () {
        expect(tableTree.vm.rowCollection.items[0].firstName).toBe('arne');

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

        expect(tableTree.vm.rowCollection.items[0].animal).toBe('salmon');
    });

    it('updates the border and background', function () {
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
