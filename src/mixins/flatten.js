import Vue from 'vue';

export default {
    computed: {
        flattenedRows () {
            return this.flatten(this.paginatedRows);
        },
    },

    methods: {
        async toggleChildren (row) {
            row._showChildren = !row._showChildren;

            if (!row._hasChildren) {
                return;
            }

            row._meta.loading = true;
            row._children = this.initRows(await this.callChildren(row), row);
            Vue.delete(row, '_hasChildren');
            row._meta.loading = false;
        },

        flatten (rows) {
            return rows
                .reduce((flattenedRows, row) => {
                    return flattenedRows.concat([
                        row,
                        ...(row && row._showChildren ? this.flatten(row._meta.visibleChildren) : []),
                    ]);
                }, []);
        },
    },
};
