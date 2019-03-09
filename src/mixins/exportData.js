export default {
    computed: {
        exportColumns () {
            return this.columns.filter(column => column.export);
        },
    },

    methods: {
        exportTable (name, full) {
            if (!name) {
                return;
            }

            this.$emit(
                'export',
                {
                    fields: Object.assign({
                        '#': '_order',
                    }, this.exportFields()),
                    data: this.exportData(full ? this.loadedRows : this.sortedRows, full),
                    title: name,
                }
            );
        },

        exportFields () {
            return this.exportColumns
                .reduce((result, column) => {
                    result[column.title] = column.property;

                    return result;
                }, {});
        },

        exportData (rows, full, parent = '') {
            return rows
                .reduce((exportRows, row, index) => {
                    let order = parent + (index + 1).toString();
                    row._order = order + (parent === '' ? '-0' : '');
                    return exportRows.concat([
                        row,
                        ...(full ?
                            (row && row._children ? this.exportData(row._children, full, order + '-') : []) :
                            (row && row._showChildren ? this.exportData(row._meta.visibleChildren, full, order + '-') : [])
                        ),
                    ]);
                }, []);
        },
    },
};
