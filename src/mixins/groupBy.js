// TODO how to handle grouped data for async data

export default {
    computed: {
        groupedRows () {
            if (this.paginatedRows.length === 0) {
                return this.paginatedRows;
            }

            return this.groupingRows(this.paginatedRows, 0);
        },
    },

    methods: {
        groupingRows (rows, groupColumnIndex) {
            if (groupColumnIndex === this.groupColumns.length) {
                return rows;
            }

            let column = this.groupColumns[groupColumnIndex];

            let previousValue = null;
            let groups = [];
            let groupedRows = [];
            let value;


            rows.forEach(row => {
                value = this.rowValue(row, column);

                if (previousValue === null) {
                    previousValue = value;
                }

                if (value !== previousValue) {
                    groups.push(this.createGroupRow(previousValue, column, groupedRows, groups.length, groupColumnIndex + 1));

                    previousValue = value;
                    groupedRows = [];
                }

                groupedRows.push(row);
            });

            groups.push(this.createGroupRow(value, column, groupedRows, groups.length, groupColumnIndex + 1));

            if (groupColumnIndex > 0) {
                groups.forEach(row => row._meta.groupParent += 1);
            }

            return groups;
        },

        rowValue (row, column) {
            let value = row[column.property];

            if (column.groupBy instanceof Function) {
                value = column.groupBy(value);
            }

            return value;
        },

        createGroupRow (value, column, groupedRows, groupLength, groupColumnIndex) {
            groupedRows.forEach(row => row._meta.groupParent = groupColumnIndex);
            groupedRows = this.groupingRows(groupedRows, groupColumnIndex);

            let groupRow = {
                [column.property]: value,
                _children: groupedRows,
                _showChildren: true,
            };

            this.initRow(groupRow, 0, groupLength, column);

            return groupRow;
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
