import { shallowMount } from '@vue/test-utils';

import Table from '../../../src/components/AsyncTable';

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

        rows.length = 8;

        table = shallowMount(Table, {
            propsData: {
                rows,
                columns,
                start: 0,
                end: 4,
            },
        });
    });

    it('load root rows if the range changes and those rows are still undefined', () => {
        table.setProps({
            start: 4,
            end: 8,
        });

        expect(table.vm.indexesToLoad).toEqual([
            4,
            5,
            6,
            7,
        ]);
    });

    it('is resolved no filtering or sorting happens', () => {
        expect(table.vm.unresolved).toBeFalsy();
    });
});
