export default {
    props: {
        exportName: {
            type: String,
            default: '',
        },

        fullExport: {
            type: Boolean,
            default: true,
        },
    },

    watch: {
        exportName: {
            handler: 'exportNameChanged',
            immediate: true,
        },
    },

    computed: {
        exportColumns () {
            return this.columns.filter(column => column.export);
        },

        exportRows () {
            return this.fullExport ? this.loadedRows : this.sortedRows;
        },
    },

    methods: {
        exportNameChanged () {
            if (!this.exportName || this.exportName.length === 0) {
                return;
            }

            this.$emit(
                'export',
                {
                    fields: Object.assign({
                        '#': '_order',
                    }, this.exportFields()),
                    data: this.exportData(this.exportRows),
                    title: this.exportName,
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

        exportData (rows, parent = '') {
            return rows
                .reduce((exportRows, row, index) => {
                    let order = parent + (index + 1).toString();
                    row._order = order + (parent === '' ? '-0' : '');
                    return exportRows.concat([
                        row,
                        ...(this.fullExport ?
                            (row && row._children ? this.exportData(row._children, order + '-') : []) :
                            (row && row._showChildren ? this.exportData(row._meta.visibleChildren, order + '-') : [])
                        ),
                    ]);
                }, []);
        },
    },
};
