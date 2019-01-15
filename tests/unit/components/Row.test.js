import { shallowMount } from '@vue/test-utils';

import RowComponent from '../../../src/components/Row';
import Row from '../../../src/models/Row';
import Column from '../../../src/models/Column';
import ColumnCollection from '../../../src/collections/ColumnCollection';
import ClassesProcessor from '../../../src/services/ClassProcessor';

describe('Row', () => {
    let component;
    let row;
    let columns;
    let columnA;
    let columnB;


    beforeEach(() => {
        row = new Row({
            firstName: 'Arne',
            lastName: 'De Smedt',
        });

        columnA = new Column({
            property: 'firstName',
        });
        columnB = new Column({
            property: 'lastName',
        });

        columns = new ColumnCollection([
            columnA,
            columnB,
        ]);

        component = shallowMount(RowComponent, {
            propsData: {
                row,
                columns,
                rowIndex: 0,
                classes: new ClassesProcessor({}, 0),
            },
        });
    });

    it('renders a row', () => {
        expect(component.html()).toMatchSnapshot();
    });

    it('selects the correct column slot', () => {
        component.setProps({
            slots: {
                firstName: 'test',
                lastName: 'test2',
            },
        });

        expect(component.vm.columnSlot(columnA)).toBe('test');
    });

    it('selects the correct cell slot', () => {
        component.setProps({
            slots: {
                firstName_Arne: 'testcell',
                firstName: 'test',
            },
        });

        expect(component.vm.columnSlot(columnA)).toBe('testcell');
    });
});
