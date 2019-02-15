export default {
    props: {
        start: {
            type: Number,
            validator: start => {
                return start >= 0;
            },
        },

        end: {
            type: Number,
            validator: end => {
                return end >= 0;
            },
        },
    },

    computed: {
        paginatedRows () {
            if (this.unresolved) {
                return this.sortedRows;
            }

            return this.sortedRows.slice(this.start, this.end);
        },
    },
};
