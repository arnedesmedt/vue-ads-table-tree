// TODO how to handle grouped data for async data

export default {
    data () {
        return {
            groupRows: [],
        };
    },

    computed: {
        groupedRows () {
            if (this.paginatedRows.length === 0) {
                return this.paginatedRows;
            }

            this.groupRows = [];
            return this.groupingRows(this.paginatedRows);
        },
    },

    methods: {
        groupingRows (rows) {
            if (this.groupColumns.length === 0) {
                rows.forEach(row => {
                    row._meta.groupParent = 0;
                });
                return rows;
            }

            this.groupColumns
                .forEach(column => {
                    let previousValue = null;
                    let groups = [];
                    let group = [];
                    let i, value;
                    for (i = 0; i < rows.length; i++) {
                        let row = rows[i];
                        let nonGroupRow = this.firstNonGroupRow(row);
                        value = this.nonGroupRowValue(nonGroupRow, column);

                        if (previousValue === null) {
                            previousValue = value;
                        }

                        if (value !== previousValue) {
                            groups.push(this.createGroupRow(previousValue, column, group, i));

                            previousValue = value;
                            group = [];
                        }

                        group.push(row);
                    }

                    groups.push(this.createGroupRow(value, column, group, i));

                    rows = groups;
                });

            return rows;
        },

        firstNonGroupRow (row) {
            while (row._meta.groupColumn) {
                row = row._meta.visibleChildren[0];
            }

            return row;
        },

        nonGroupRowValue (row, column) {
            let value = row[column.property];

            if (column.groupBy instanceof Function) {
                value = column.groupBy(value);
            }

            return value;
        },

        createGroupRow (value, column, group, index) {
            group.forEach(row => {
                this.updateGroupParent(row, 1);
            });
            let groupRow = {
                [column.property]: value,
                _children: group,
                _showChildren: true,
            };

            this.initRow(groupRow, 0, index, column);
            this.groupRows.push(groupRow);

            return groupRow;
        },

        updateGroupParent (row, parent) {
            row._meta.groupParent = parent;
            row._meta.visibleChildren.forEach(childRow => {
                this.updateGroupParent(childRow, childRow._meta.groupColumn ? parent + 1 : parent);
            });
        },

        async group (column) {
            column.grouped = !column.grouped;
            column.direction = column.grouped ? !column.direction : null;
            column.order = this.maxSortOrder() + 1;

            // Todo For now, no async data
            // if (this.unresolved) {
            //     await this.handleUnresolved();
            // }
        },
    },
};
