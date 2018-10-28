import { shallowMount } from '@vue/test-utils';

import BodyRow from '../../../src/components/BodyRow';
import Row from '../../../src/models/Row';
import Column from '../../../src/models/Column';
import Styling from '../../../src/models/Styling';

describe('BodyRow', () => {
    let bodyRow;

    beforeEach(() => {
        bodyRow = shallowMount(BodyRow, {
            propsData: {
                styling: new Styling({
                    columnsAllExceptLast: 'border-b',
                    rowsOdd: 'bg-grey-lightest',
                    rowsAll: false,
                }),
                row: new Row({
                    firstName: 'arne',
                }),
                columns: [
                    new Column({
                        property: 'firstName',
                    }),
                ],
                index: 0,
            },
        });
    });

    it('returns the default row classes', () => {
        expect(bodyRow.vm.styling.rowClasses(0)).toEqual({
            'vue-ads-table-tree-border-b': true,
            'vue-ads-table-tree-bg-grey-lightest': true,
        });
    });
});
