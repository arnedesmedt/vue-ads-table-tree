import { shallowMount } from '@vue/test-utils';

import BodyRow from '../../../src/components/BodyRow';
import Row from '../../../src/models/Row';
import Column from '../../../src/models/Column';
import Border from '../../../src/models/Border';
import Background from '../../../src/models/Background';

describe('BodyRow', () => {
    let bodyRow;

    beforeEach(() => {
        bodyRow = shallowMount(BodyRow, {
            propsData: {
                border: new Border({
                    vertical: true,
                }),
                background: new Background({
                    odd: true,
                    hover: false,
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

    it('returns the default row classes', function () {
        expect(bodyRow.vm.rowClasses).toEqual({
            'border-b ': true,
            'bg-grey-lightest': true,
        });
    });
});
