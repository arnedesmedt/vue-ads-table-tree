import { shallowMount } from '@vue/test-utils';

import Cell from '../../../src/components/Cell';
import Row from '../../../src/models/Row';
import Column from '../../../src/models/Column';
import ClassProcessor from '../../../src/services/ClassProcessor';

describe('Cell', () => {
    let cell;

    beforeEach(() => {
        cell = shallowMount(Cell, {
            propsData: {
                row: new Row({
                    firstName: 'arne',
                }),
                column: new Column({
                    property: 'firstName',

                }),
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
        cell.setProps({
            row: new Row({
                parent: new Row(),
            }),

            column: new Column({
                collapseIcon: true,
            }),
        });

        expect(cell.vm.style['padding-left']).toBe('2.5rem');
    });

    it('adds a toggle children button if the row has children', () => {
        cell.setProps({
            row: new Row({
                hasChildren: true,
            }),
        });

        expect(cell.html()).toMatchSnapshot();
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
