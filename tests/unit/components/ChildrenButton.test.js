import { shallowMount } from '@vue/test-utils';
import ChildrenButton from '../../../src/components/ChildrenButton';

describe('ChildrenButton', () => {
    it('show the + sign by default', () => {
        const childrenButton = shallowMount(ChildrenButton, {
            propsData: {
                expanded: false,
                loading: false,
            },
        });

        expect(childrenButton.vm.classes).toEqual({
            'fa-plus-square': true,
            'fa-minus-square': false,
        });
    });

    it('shows the - sign if the component is expanded', () => {
        const childrenButton = shallowMount(ChildrenButton, {
            propsData: {
                expanded: true,
                loading: false,
            },
        });

        expect(childrenButton.vm.classes).toEqual({
            'fa-plus-square': false,
            'fa-minus-square': true,
        });
    });

    it('shows the loading sign if the component is loading', () => {
        const childrenButton = shallowMount(ChildrenButton, {
            propsData: {
                expanded: false,
                loading: true,
            },
        });

        expect(childrenButton.vm.classes).toEqual({
            'fa-ellipsis-h': true,
        });
    });
});
