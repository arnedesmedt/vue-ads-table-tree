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
    },
};
