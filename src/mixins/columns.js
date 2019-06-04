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
                .sort((columnA, columnB) => {
                    if (columnA.grouped !== columnB.grouped) {
                        return (!columnB.grouped | 0) - (!columnA.grouped | 0);
                    }

                    return columnA.grouped ? (columnB.order - columnA.order) : (columnA.order - columnB.order);
                });
        },

        nonGroupedColumns () {
            return this.visibleColumns.filter(column => !column.grouped || !column.hideOnGroup || column.collapseIcon);
        },

        groupColumns () {
            return this.visibleColumns
                .filter(column => column.groupable && column.grouped)
                .sort((columnA, columnB) => columnB.order - columnA.order);
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

            if (columns.length > 0) {
                if (!columns.find(column => column.collapseIcon)) {
                    Vue.set(columns[0], 'collapseIcon', true);
                }
            }

            // todo check to remove this to the styling mixin
            this.cssProcessor.totalColumns = this.nonGroupedColumns.length;
        },

        initColumn (column, order) {
            if (typeof column.property !== 'string') {
                Vue.set(column, 'property', '');
            }

            if (!column.hasOwnProperty('visible')) {
                Vue.set(column, 'visible', true);
            }

            if (!column.hasOwnProperty('export')) {
                Vue.set(column, 'export', true);
            }

            if (column.hasOwnProperty('order') || column.hasOwnProperty('direction')) {
                if (!Number.isInteger(column.order) || column.order < 0) {
                    column.order = order;
                }

                if (!column.hasOwnProperty('direction')) {
                    Vue.set(column, 'direction', null);
                }
            }

            if (!column.hasOwnProperty('groupable')) {
                Vue.set(
                    column,
                    'groupable',
                    (
                        column.hasOwnProperty('grouped') ||
                        column.hasOwnProperty('groupBy') ||
                        column.hasOwnProperty('groupCollapsable') ||
                        column.hasOwnProperty('hideOnGroup')
                    )
                );
            }

            if (column.groupable && !column.hasOwnProperty('grouped')) {
                Vue.set(column, 'grouped', false);
            }

            if (column.groupable && !column.hasOwnProperty('groupCollapsable')) {
                Vue.set(column, 'groupCollapsable', true);
            }

            if (column.groupable && !column.hasOwnProperty('hideOnGroup')) {
                Vue.set(column, 'hideOnGroup', !(column.groupBy instanceof Function));
            }
        },
    },
};
