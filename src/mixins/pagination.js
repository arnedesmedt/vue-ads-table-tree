export default {
    props: {
        start: {
            type: Number,
            validator: start => {
                return start >= 0 || start === null;
            },
        },

        end: {
            type: Number,
            validator: end => {
                return end >= 0 || end === null;
            },
        },
    },

    watch: {
        start: 'startChanged',
    },

    computed: {
        paginatedRows () {
            if (this.unresolved || (this.start === null && this.end === null)) {
                return this.sortedRows;
            }

            return this.sortedRows.slice(this.start, this.end);
        },
    },

    methods: {
        startChanged (value, oldValue) {
            // Detect page change and clear selection if so.
            this.clearSelection();
        },
    },
};
