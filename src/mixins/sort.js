export default {
    computed: {
        sortedRows () {
            if (this.sortColumns.length === 0 || this.unresolved) {
                return this.filteredRows;
            }

            return this.rowsSorted(this.filteredRows);
        },
    },

    methods: {
        maxSortOrder () {
            return this.visibleColumns.reduce((max, column) => {
                return max < column.order ? column.order : max;
            }, 0);
        },

        rowsSorted (rows) {
            this.sortColumns
                .forEach(column => {
                    let direction = column.direction ? 1 : -1;
                    rows.sort((rowA, rowB) => {
                        let sortValueA = rowA[column.property];
                        let sortValueB = rowB[column.property];

                        if (typeof sortValueA === 'string' && typeof  sortValueB === 'string') {
                            return direction * ('' + sortValueA.localeCompare(sortValueB));
                        }

                        if (sortValueA < sortValueB) {
                            return -direction;
                        }

                        if (sortValueA > sortValueB) {
                            return direction;
                        }

                        return 0;
                    });
                });

            rows
                .filter(row => row._meta.visibleChildren.length > 0)
                .forEach(row => {
                    row._meta.visibleChildren = this.rowsSorted(row._meta.visibleChildren);
                });

            return rows;
        },

        async sort (column) {
            column.direction = !column.direction;
            column.order = this.maxSortOrder() + 1;

            if (this.unresolved) {
                await this.handleUnresolved();
            }
        },
    },
};
