export default {
    props: {
        sortIconSlot: {
            type: Function,
            default: null,
        },
    },

    computed: {
        sortable () {
            return [
                null,
                true,
                false,
            ].includes(this.column.direction);
        },

        sortIconClasses () {
            if (!this.sortable) {
                return {};
            }

            return {
                fa: true,
                'vue-ads-ml-2': true,
                'fa-sort': this.column.direction === null,
                'fa-sort-down': this.column.direction === false,
                'fa-sort-up': this.column.direction === true,
            };
        },
    },

    methods: {
        sortIcon (createElement) {
            return this.sortIconSlot ?
                this.sortIconSlot({
                    index: this.column.property,
                    direction: this.column.direction,
                }) :
                createElement(
                    'i',
                    {
                        class: this.sortIconClasses,
                        on: {
                            click: (event) => {
                                event.stopPropagation();
                                this.$emit('sort', this.column);
                            },
                        },
                    },
                );
        },
    },
};
