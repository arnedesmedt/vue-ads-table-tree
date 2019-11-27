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
            return {
                ...this.slots, ...this.$scopedSlots,
            };
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
