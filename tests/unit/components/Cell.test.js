import { shallowMount } from '@vue/test-utils';

import Cell from '../../../src/components/Cell';
import Row from '../../../src/models/Row';
import Column from '../../../src/models/Column';
import ClassProcessor from '../../../src/services/ClassProcessor';

describe('Cell', () => {
    let cell;
    let row;
    let column;

    beforeEach(() => {
        row = new Row({
            firstName: 'arne',
        });

        column = new Column({
            property: 'firstName',

        });

        cell = shallowMount(Cell, {
            propsData: {
                row,
                column,
                rowIndex: 0,
                classes: new ClassProcessor({}, 0),
            },
        });
    });

    it('returns the default cell classes', () => {
        expect(cell.vm.cellClasses).toEqual({
            'vue-ads-px-4': true,
            'vue-ads-py-2': true,
            'vue-ads-text-sm': true,
        });

        expect(cell.vm.style['padding-left']).toBe('1rem');

        expect(cell.html()).toMatchSnapshot();
    });

    it('changes the padding if the number of parents changes', () => {
        let child = new Row();
        new Row({
            children: [
                child,
            ],
        });

        cell.setProps({
            row: child,
            column: new Column({
                collapseIcon: true,
            }),
        });

        expect(cell.vm.style['padding-left']).toBe('2.5rem');
    });

    it('adds a toggle children button if the row has children and the column owns the button', () => {
        row = new Row({
            firstName: 'arne',
            hasChildren: true,
        });

        column = new Column({
            property: 'firstName',
            collapseIcon: true,

        });

        cell.setProps({
            row,
            column,
        });


        expect(cell.html()).toContain('fa-plus-square');
    });

    it('creates a column slot', () => {
        cell.setProps({
            columnSlot: props => {
                return `Test: ${props.row.firstName}`;
            },
        });

        expect(cell.text()).toBe('Test: arne');
    });

    it('is empty with no matching properties', () => {
        cell.setProps({
            row: new Row({
                lastName: 'de smedt',
            }),
        });

        expect(cell.text()).toBe('');
    });

    it('emits toggle children, when calling toggle children', () => {
        cell.vm.toggleChildren();

        expect(cell.emitted().toggleChildren).toBeTruthy();
    });
});
