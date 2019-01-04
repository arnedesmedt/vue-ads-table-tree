<template>
    <div
        id="app"
        class="m-6">
        <div class="mb-6">
            <vue-ads-table-tree
                :columns="columns"
                :rows="rows"
                :filter="filterValue"
                :page="page"
                :classes="classes"
                :async="asyncCall"
                :total-rows="50"
            >
                <template slot="title">
                    <h2 class="font-bold uppercase">
                        Belgium royal family
                    </h2>
                </template>
                <template
                    slot="firstName"
                    slot-scope="props">
                    <a
                        :href="`https://www.google.com/search?q=${props.row.firstName}+${props.row.lastName}`"
                        target="_blank">{{ props.row.firstName }}</a>
                </template>
                <template slot="filter">
                    <h3 class="inline pr-2">Filter:</h3>
                    <input
                        v-model="filterValue"
                        class="appearance-none border py-2 px-3"
                        type="text"
                        placeholder="Filter..."
                    >
                </template>
                <template
                    slot="pagination"
                    slot-scope="props"
                >
                    <vue-ads-pagination
                        :total-items="props.total"
                        :page="page"
                        :loading="props.loading"
                        :items-per-page="5"
                        @page-change="props.pageChange"
                    >
                        <template slot-scope="props">
                            <div class="vue-ads-pr-2 vue-ads-leading-loose">
                                Items {{ props.start }} tot {{ props.end }} van de {{ props.total }}
                            </div>
                        </template>
                        <template
                            slot="buttons"
                            slot-scope="props"
                        >
                            <vue-ads-page-button
                                v-for="(button, key) in props.buttons"
                                :key="key"
                                v-bind="button"
                                :class="{'bg-yellow-dark': button.active}"
                                @page-change="page = button.page"
                            />
                        </template>
                    </vue-ads-pagination>
                </template>
            </vue-ads-table-tree>
        </div>
    </div>
</template>

<script>
import './assets/css/tailwind.css';
import '../node_modules/@fortawesome/fontawesome-free/css/all.css';
import VueAdsTableTree from './components/TableTree';
import VueAdsPagination, { VueAdsPageButton } from '../node_modules/vue-ads-pagination/dist/vue-ads-pagination.common';

// todo show pagination on loading

export default {
    name: 'App',

    components: {
        VueAdsTableTree,
        VueAdsPagination,
        VueAdsPageButton,
    },

    data () {
        return {
            page: 0,
            filterValue: '',
            classes: {
                table: {
                    'vue-ads-border': true,
                    'vue-ads-w-full': true,
                },
                info: {
                    'vue-ads-text-center': true,
                    'vue-ads-py-6': true,
                    'vue-ads-text-sm': true,
                },
                'all/': {
                    'hover:vue-ads-bg-grey-lighter': true,
                },
                'even/': {
                    'vue-ads-bg-grey-lightest': true,
                },
                'odd/': {
                    'vue-ads-bg-white': true,
                },
                '0/': {
                    'vue-ads-bg-grey-lightest': false,
                    'hover:vue-ads-bg-grey-lighter': false,
                },
                '0_-1/': {
                    'vue-ads-border-b': true,
                },
                '/0_-1': {
                    'vue-ads-border-r': true,
                },
            },
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
                    firstName: 'Josephine',
                    lastName: 'Astrid',
                },
                {
                    firstName: 'Boudewijn',
                    lastName: 'Van Brabandt',
                },
                {
                    firstName: 'Albert II',
                    lastName: 'Van Belgie',
                    children: [
                        {
                            firstName: 'Filip',
                            lastName: 'Van Belgie',
                            children: [
                                {
                                    firstName: 'Elisabeth',
                                    lastName: 'Van Brabant',
                                },
                                {
                                    firstName: 'Gabriel',
                                    lastName: 'Boudwijn',
                                },
                                {
                                    firstName: 'Emmanuel',
                                    lastName: 'Van Belgie',
                                },
                                {
                                    firstName: 'Eleonore',
                                    lastName: 'Boudwijn',
                                    hasChildren: true,
                                },
                            ],
                        },
                        {
                            firstName: 'Astrid',
                            lastName: 'Van Belgie',
                        },
                        {
                            firstName: 'Laurent',
                            lastName: 'Van Belgie',
                        },

                    ],
                },
                {
                    firstName: 'Alexander',
                    lastName: 'Van Belgie',
                },
                {
                    firstName: 'Marie-Christine',
                    lastName: 'Leopoldine',
                },
                {
                    firstName: 'Marie-Esmeralda',
                    lastName: 'Leopoldine',
                },
                {
                    firstName: 'Alexander',
                    lastName: 'Van Belgie',
                },
                {
                    firstName: 'Marie-Christine',
                    lastName: 'Leopoldine',
                },
                {
                    firstName: 'Marie-Esmeralda',
                    lastName: 'Leopoldine',
                },
                {
                    firstName: 'Alexander',
                    lastName: 'Van Belgie',
                },
                {
                    firstName: 'Marie-Christine',
                    lastName: 'Leopoldine',
                },
                {
                    firstName: 'Marie-Esmeralda',
                    lastName: 'Leopoldine',
                },
            ],
        };
    },

    methods: {
        async asyncCall (filter, sortColumns, start, end, parent) {
            await this.sleep(1000);

            let startRows = this.rows;
            if (parent) {
                startRows = this.rows.slice(3, 5);
            }

            let filteredRows = this.filter(startRows, filter);
            let sortedRows = this.sort(filteredRows, sortColumns);

            let diff = start - (start % 10);
            let rows = parent ? sortedRows : sortedRows.slice(start % 10, end - diff);

            return {
                total: filter ? 100 : 25,
                rows,
            };
        },

        filter (rows, filter) {
            if (!filter) {
                return rows;
            }

            let regex = new RegExp(filter, 'i');

            return rows.filter(row => {
                return regex.test(row.firstName) || regex.test(row.lastName);
            });
        },

        sort (rows, sortColumns) {
            if (!sortColumns.length) {
                return rows;
            }

            let sortedRows = rows;

            sortColumns
                .filter(sortColumn => sortColumn.direction !== null)
                .forEach(sortColumn => {
                    sortedRows.sort((a, b) => {
                        a = a[sortColumn.property];
                        b = b[sortColumn.property];

                        return (sortColumn.direction ? 1 : -1) * ('' + a.localeCompare(b));
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
