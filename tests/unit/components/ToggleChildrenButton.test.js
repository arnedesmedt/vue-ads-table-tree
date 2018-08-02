import { shallowMount } from '@vue/test-utils';
import ToggleChildrenButton from '../../../src/components/ToggleChildrenButton';

describe('ToggleChildrenButton', () => {
    it('show the + sign by default', function () {
        const toggleChildrenButton = shallowMount(ToggleChildrenButton);

        expect(toggleChildrenButton.vm.toggleChildrenButtonClasses).toEqual({
            'fa-plus-square': true,
            'fa-minus-square': false,
            'fa-ellipsis-h': false,
        });
    });

    it('shows the - sign if the component is expanded', function () {
        const toggleChildrenButton = shallowMount(ToggleChildrenButton, {
            propsData: {
                expanded: true,
            },
        });

        expect(toggleChildrenButton.vm.toggleChildrenButtonClasses).toEqual({
            'fa-plus-square': false,
            'fa-minus-square': true,
            'fa-ellipsis-h': false,
        });
    });

    it('shows the loading sign if the component is loading', function () {
        const toggleChildrenButton = shallowMount(ToggleChildrenButton, {
            propsData: {
                loading: true,
            },
        });

        expect(toggleChildrenButton.vm.toggleChildrenButtonClasses).toEqual({
            'fa-plus-square': false,
            'fa-minus-square': false,
            'fa-ellipsis-h': true,
        });
    });
});
