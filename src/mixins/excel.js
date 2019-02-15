export default {
    props: {
        excel: {
            type: Boolean,
            default: false,
        },
    },

    watch: {
        excel: {
            handler: 'excelChanged',
            immediate: true,
        },
    },

    computed: {
        excelColumns () {
            return this.columns.filter(column => column.excel);
        },
    },

    methods: {
        excelChanged () {
            if (!this.excel) {
                return;
            }

            this.$emit(
                'excel',
                {
                    fields: Object.assign({
                        '#': '_order',
                    }, this.excelFields()),
                    data: this.excelData(this.sortedRows),
                }
            );
        },

        excelFields () {
            return this.excelColumns
                .reduce((result, column) => {
                    result[column.title] = column.property;

                    return result;
                }, {});
        },

        excelData (rows, parent = '') {
            return rows
                .reduce((excelRows, row, index) => {
                    let order = parent + (index + 1).toString() + '-';
                    row._order = order + (parent === '' ? '0' : '');
                    return excelRows.concat([
                        row,
                        ...(row && row._showChildren ? this.excelData(row._meta.visibleChildren, order) : []),
                    ]);
                }, []);
        },
    },
};
