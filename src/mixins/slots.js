export default {
    props: {
        slots: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },

    computed: {
        currentSlots () {
            if (Object.keys(this.slots).length === 0) {
                return Object.assign(this.$slots, this.$scopedSlots);
            }

            return this.slots;
        },

        sortIconSlot () {
            return this.currentSlots['sort-icon'] || null;
        },

        toggleChildrenIconSlot () {
            return this.currentSlots['toggle-children-icon'] || null;
        },

        rowSlots () {
            let regexCell = new RegExp('^(' + this.columnProperties.join('|') + ')_', 'i');
            let regexRow = new RegExp('^_.+$', 'i');
            let slots = {};

            Object.keys(this.currentSlots)
                .forEach(slotKey => {
                    if (this.columnProperties.includes(slotKey) || regexCell.test(slotKey) || regexRow.test(slotKey)) {
                        slots[slotKey] = this.currentSlots[slotKey];
                    }
                });

            return slots;
        },
    },
};
