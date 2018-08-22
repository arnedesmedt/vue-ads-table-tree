<template>
    <div id="app">
        <table-tree
            :columns="columns"
            :asyncCall="asyncCall"
            :rows="rows"
            :useCache="true"
            :itemsPerPage="2"
            :totalRows="50"
            :paginationButtonClasses="{default: ['border-none'], active: ['bg-orange']}"
        >
            <template>
                <h2
                    class="block pl-3 leading-normal"
                >
                    My own title
                </h2>
            </template>
            <template slot="pagination" slot-scope="props">
                Items {{ props.range.start}} tot {{ props.range.end }} van de {{ props.range.total }}
            </template>
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

            let rows = parent ? sortedRows : sortedRows.slice(range.start % 10, range.end % 10);

            return {
                total: filter ? filteredRows.length : 50,
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
