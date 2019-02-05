export default {
    props: {
        columns: {
            type: Array,
            required: true,
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
};
