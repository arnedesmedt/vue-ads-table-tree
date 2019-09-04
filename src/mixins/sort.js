export default {
    computed: {
        sortedRows () {
            if (this.unresolved) {
                return this.filteredRows;
            }

            return this.sortRows(this.filteredRows);
        },
    },

    methods: {
        maxSortOrder () {
            return this.visibleColumns.reduce((max, column) => {
                return max < column.order ? column.order : max;
            }, 0);
        },

        sortRows (rows) {
            rows.sort((rowA, rowB) => {
                return rowA._meta.index - rowB._meta.index;
            });

            this.sortColumns
                .forEach(column => {
                    let direction = column.direction ? 1 : -1;
                    rows.sort((rowA, rowB) => {
                        let sortValueA = rowA[column.property];
                        let sortValueB = rowB[column.property];

                        if (column.grouped && column.groupBy instanceof Function) {
                            sortValueA = column.groupBy(sortValueA);
                            sortValueB = column.groupBy(sortValueB);
                        }

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
                    row._meta.visibleChildren = this.sortRows(row._meta.visibleChildren);
                });

            return rows;
        },

        async sort (column) {
            this.clearSelection();

            let wasFalse = column.direction === false;
            column.direction = wasFalse && !column.grouped ? null : !column.direction;
            column.order = this.maxSortOrder() + 1;

            if (this.unresolved) {
                await this.handleUnresolved();
            }
        },
    },
};
