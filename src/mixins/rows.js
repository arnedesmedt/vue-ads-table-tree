import Vue from 'vue';
import uuid from 'uuid';

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
                .forEach((row, index) => this.initRow(row, parent, index));
            rows
                .filter(row => row._children.length > 0)
                .forEach(row => this.rowsChanged(row._children, null, row));

            return rows;
        },

        initRow (row, parent, index, groupColumn = null) {
            if (!row.hasOwnProperty('_children')) {
                Vue.set(row, '_children', []);
            }

            if (!row.hasOwnProperty('_showChildren')) {
                Vue.set(row, '_showChildren', false);
            }

            if (!row.hasOwnProperty('_selectable')) {
                let selectable = parent && parent.hasOwnProperty('_selectable') ? parent._selectable : this.selectable;
                Vue.set(row, '_selectable', selectable);
            }

            if (!row.hasOwnProperty('_meta')) {
                Vue.set(row, '_meta', {
                    groupParent: 0,
                    parent: parent ? parent._meta.parent + 1 : 0,
                    uniqueIndex: uuid(),
                    loading: false,
                    visibleChildren: row._children,
                    index,
                    groupColumn,
                    selected: false,
                });
            }
        },
    },
};
