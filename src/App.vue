<template>
    <div id="app">
        <input v-model="page"/>
        <table-tree
            :columns="columns"
            :rows="rows"
            :itemsPerPage="2"
            :page="parseInt(page)"
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
            page: 0,
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
        asyncCall () {
            return async (range, filter, sortColumns, parent) => {
                await this.sleep(1000);

                // console.log(range, filter, sortColumns, parent);

                return {
                    total: filter ? 6 : 20,
                    rows: filter ? this.rows.slice(1, 4) : this.rows.slice(7),
                };
            };
        },

        sleep (ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
    },
};
</script>
