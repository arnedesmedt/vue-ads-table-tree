<template>
    <div id="app">
        <table-tree
            :columns="columns"
            :asyncCall="asyncCall"
            :useCache="true"
            :itemsPerPage="3"
        >
        </table-tree>
  </div>
</template>

<script>
import TableTree from './components/TableTree';

export default {
    name: 'app',

    components: {
        TableTree,
    },

    data () {
        return {
            columns: [
                {
                    property: 'firstName',
                    title: 'First Name',
                    sortable: true,
                    filterable: true,
                },
                {
                    property: 'lastName',
                    title: 'Last Name',
                    filterable: true,
                    sortable: true,
                },
            ],
            rows: [
                {
                    firstName: 'Jef',
                    lastName: 'Vandenhende',
                    showChildren: false,
                    children: [
                        {
                            firstName: 'Bart',
                            lastName: 'Delanghe',
                        },
                        {
                            firstName: 'Jane',
                            lastName: 'Delanghe',
                            showChildren: false,
                            children: [
                                {
                                    firstName: 'Bert',
                                    lastName: 'De Smedt',
                                },
                                {
                                    firstName: 'Hendrik',
                                    lastName: 'Eeckhout',
                                },
                            ],
                        },
                    ],
                },
                {
                    firstName: 'Alice',
                    lastName: 'De Smedt',
                },
                {
                    firstName: 'Sander',
                    lastName: 'De Smedt',
                },
                {
                    firstName: 'Stan',
                    lastName: 'Vandenhende',
                },
                {
                    firstName: 'Lieve',
                    lastName: 'Desplintere',
                },
                {
                    firstName: 'Iebe',
                    lastName: 'Meirhaege',
                    showChildren: false,
                    children: [
                        {
                            firstName: 'Filip',
                            lastName: 'Meirhaege',
                        },
                        {
                            firstName: 'Haike',
                            lastName: 'Lewyllie',
                            showChildren: false,
                            children: [
                                {
                                    firstName: 'Niel',
                                    lastName: 'De Smedt',
                                },
                                {
                                    firstName: 'Jana',
                                    lastName: 'Vandenhende',
                                },
                            ],
                        },
                    ],
                },
                {
                    firstName: 'Bob',
                    lastName: 'Debouwer',
                },
                {
                    firstName: 'Alice',
                    lastName: 'Vandermeer',
                    hasChildren: true,
                    showChildren: false,
                },
                {
                    firstName: 'Bert',
                    lastName: 'De Smedt',
                },
                {
                    firstName: 'Hendrik',
                    lastName: 'Vandenhende',
                },
            ],
        };
    },

    methods: {
        async asyncCall (range, filter, sortColumns, parent) {
            await this.sleep(1000);

            let startRows = this.rows;
            if (parent) {
                startRows = this.rows.slice(1, 3);
            }

            let filteredRows = this.filter(startRows, filter);
            let sortedRows = this.sort(filteredRows, sortColumns);

            console.log(sortedRows);

            let rows = parent ? sortedRows : sortedRows.slice(range.start, range.end);

            return {
                total: sortedRows.length,
                rows,
            };
        },

        filter (rows, filter) {
            let regex = new RegExp(filter, 'i');

            return rows.filter(row => {
                return regex.test(row.firstName) || regex.test(row.lastName);
            });
        },

        sort (rows, sortColumns) {
            let sortedRows = rows;

            sortColumns.forEach(sortColumn => {
                if (sortColumn.direction === null) {
                    return;
                }

                sortedRows.sort((a, b) => {
                    a = a[sortColumn.property];
                    b = b[sortColumn.property];

                    if (a < b) {
                        return sortColumn.direction ? -1 : 1;
                    }

                    if (a > b) {
                        return sortColumn.direction ? 1 : -1;
                    }

                    return 0;
                });
            });

            return sortedRows;
        },

        sleep (ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
    },
};
</script>
