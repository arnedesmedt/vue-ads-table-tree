import { shallowMount } from '@vue/test-utils';

import BodyCell from '../../../src/components/BodyCell';
import Row from '../../../src/models/Row';
import Column from '../../../src/models/Column';
import Styling from '../../../src/models/Styling';

describe('BodyCell', () => {
    let bodyCell;

    beforeEach(() => {
        bodyCell = shallowMount(BodyCell, {
            propsData: {
                styling: new Styling({
                    columnsAllExceptLast: 'vue-ads-table-tree-border-r',
                }),
                row: new Row({
                    firstName: 'arne',
                }),
                column: new Column({
                    property: 'firstName',
                }),
                index: 0,
            },
        });
    });

    it('returns the default cell classes', () => {
        expect(bodyCell.vm.cellClasses).toEqual({
            'vue-ads-table-tree-border-r': true,
            'vue-ads-table-tree-px-4': true,
            'vue-ads-table-tree-py-2': true,
            'vue-ads-table-tree-text-sm': true,
            'vue-ads-table-tree-w-auto': true,
        });

        expect(bodyCell.vm.first).toBeTruthy();
        expect(bodyCell.vm.cellStyle['padding-left']).toBe('1rem');

        expect(bodyCell.html()).toMatchSnapshot();
    });

    it('changes the padding if the number of parents changes', () => {
        bodyCell.setProps({
            row: new Row({
                parent: new Row(),
            }),
        });

        expect(bodyCell.vm.cellStyle['padding-left']).toBe('2.5rem');
    });

    it('adds a toggle children button if the row has children', () => {
        bodyCell.setProps({
            row: new Row({
                hasChildren: true,
            }),
        });

        expect(bodyCell.html()).toMatchSnapshot();
    });

    it('is empty with no matching properties', () => {
        bodyCell.setProps({
            row: new Row({
                lastName: 'de smedt',
            }),
        });
    });

    it('emits toggle children, when calling toggle children', () => {
        bodyCell.vm.toggleChildren();

        expect(bodyCell.emitted().toggleChildren).toBeTruthy();
    });
});
