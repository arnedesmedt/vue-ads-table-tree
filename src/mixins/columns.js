import Vue from 'vue';

export default {
    props: {
        columns: {
            type: Array,
            required: true,
        },
    },

    watch: {
        columns: {
            handler: 'columnsChanged',
            immediate: true,
        },
    },

    computed: {
        visibleColumns () {
            return this.columns.filter(column => column.visible);
        },

        columnProperties () {
            return this.visibleColumns.map(column => column.property);
        },

        sortColumns () {
            return this.visibleColumns
                .filter(column => column.hasOwnProperty('direction') && column.direction !== null)
                .sort((columnA, columnB) => columnA.order - columnB.order);
        },

        filterColumnProperties () {
            return this.visibleColumns
                .filter(column => {
                    return column.filterable;
                })
                .map(column => column.property);
        },
    },

    methods: {
        columnsChanged (columns) {
            let maxSortOrder = this.maxSortOrder();
            columns.forEach(column => {
                this.initColumn(column, maxSortOrder);
                if (column.order === maxSortOrder) {
                    maxSortOrder++;
                }
            });

            if (!columns.find(column => column.collapseIcon)) {
                Vue.set(columns[0], 'collapseIcon', true);
            }

            // todo check to remove this to the styling mixin
            this.cssProcessor.totalColumns = this.visibleColumns.length;
        },

        initColumn (column, order) {
            if (typeof column.property !== 'string') {
                Vue.set(column, 'property', '');
            }

            if (!column.hasOwnProperty('visible')) {
                Vue.set(column, 'visible', true);
            }

            if (!column.hasOwnProperty('excel')) {
                Vue.set(column, 'excel', true);
            }

            if (!column.hasOwnProperty('order') && !column.hasOwnProperty('direction')) {
                return;
            }

            if (!Number.isInteger(column.order) || column.order < 0) {
                column.order = order;
            }

            if (!column.hasOwnProperty('direction')) {
                Vue.set(column, 'direction', null);
            }
        },
    },
};
