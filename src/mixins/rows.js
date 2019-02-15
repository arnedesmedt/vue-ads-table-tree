import Vue from 'vue';

export default {
    props: {
        rows: {
            type: Array,
            default: () => [],
        },
    },

    watch: {
        rows: {
            handler: 'rowsChanged',
            immediate: true,
        },
    },

    computed: {
        loadedRows () {
            return this.rows.filter(row => row);
        },
    },

    methods: {
        rowsChanged (rows, oldRows, parent) {
            this.initRows(rows, parent);
        },

        initRows (rows, parent) {
            rows
                .forEach(row => this.initRow(row, parent));
            rows
                .filter(row => row._children.length > 0)
                .forEach(row => this.rowsChanged(row._children, null, row));

            return rows;
        },

        initRow (row, parent) {
            if (!row.hasOwnProperty('_children')) {
                Vue.set(row, '_children', []);
            }

            if (!row.hasOwnProperty('_showChildren')) {
                Vue.set(row, '_showChildren', false);
            }

            if (!row.hasOwnProperty('_meta')) {
                Vue.set(row, '_meta', {
                    parent: parent ? parent._meta.parent + 1 : 0,
                    loading: false,
                    visibleChildren: row._children,
                });
            }
        },
    },
};
