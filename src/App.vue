<template>
    <div id="app">
        <table-tree
            :columns="columns"
            :asyncCall="asyncCall"
            :useCache="false"
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

            return {
                total: 10,
                rows: parent ? this.rows : this.rows.slice(range.start, range.end),
            };
        },

        sleep (ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
    },
};
</script>
