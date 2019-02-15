export default {
    props: {
        filter: {
            type: String,
            default: '',
        },
    },

    watch: {
        filter: {
            handler: 'filterChanged',
            immediate: true,
        },
    },

    computed: {
        isFiltering () {
            return this.filter !== '' && this.filterColumnProperties.length > 0;
        },

        filterRegex () {
            return new RegExp(this.filter, 'i');
        },

        filteredCurrentRows () {
            return this.unresolved ? this.currentRows.filter(row => row) : this.currentRows;
        },

        filteredRows () {
            if (this.unresolved) {
                return this.filteredCurrentRows;
            }

            // Always execute because of the children filtering.
            let filteredRows = Array.from(this.filteredCurrentRows).filter(this.rowMatch);

            if (this.isFiltering) {
                return filteredRows;
            }

            return this.filteredCurrentRows;
        },
    },

    methods: {
        async filterChanged () {
            this.totalFilteredRowsChanged(this.filteredRows.length);

            if (this.unresolved) {
                await this.handleUnresolved();
            }
        },

        totalFilteredRowsChanged (total) {
            this.$emit('total-filtered-rows-change', total);
        },

        rowMatch (row) {
            if (row === undefined) {
                return true;
            }

            row._meta.visibleChildren = row._children.filter(this.rowMatch);

            if (!this.isFiltering) {
                return true;
            }

            if (row._meta.visibleChildren.length > 0) {
                row._showChildren = true;

                return true;
            }

            return Object.keys(row)
                .filter(rowKey => this.filterColumnProperties.includes(rowKey))
                .filter(filterKey => this.filterRegex.test(row[filterKey]))
                .length > 0;
        },
    },
};
