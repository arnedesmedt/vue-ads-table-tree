<template>
    <div id="app">
        <vue-ads-table-tree
            :columns="columns"
            :rows="rows"
            :filter="filterValue"
            :page="page"
            :start="start"
            :end="end"
            :classes="classes"
        >
            <template slot="firstName_Jef" slot-scope="props">
                <a :href="`https://www.google.com/search?q=${props.row.firstName}+${props.row.lastName}`" target="_blank">{{props.row.firstName}}</a>
            </template>
            <template slot="title">
                <h2
                    class="vue-ads-block vue-ads-pl-3 vue-ads-leading-normal"
                >
                    My own title
                </h2>
            </template>
            <template slot="filter">
                <h3 class="vue-ads-inline vue-ads-pr-2">Filter:</h3>
                <input
                    class="vue-ads-appearance-none vue-ads-border vue-ads-py-2 vue-ads-px-3"
                    type="text"
                    placeholder="Filter..."
                    @input="debounceFilter($event)"
                >
            </template>
            <template slot="pagination" slot-scope="props">
                <vue-ads-pagination
                    :totalItems="props.total"
                    :page="props.page"
                    @page-change="pageChange"
                    :loading="props.loading"
                    :itemsPerPage="5"
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
                            :class="{'vue-ads-bg-yellow-dark': button.active}"
                            @page-change="page = button.page"
                        />
                    </template>
                </vue-ads-pagination>
            </template>
        </vue-ads-table-tree>

        <!--<vue-ads-table-tree-->
            <!--:columns="columns"-->
            <!--:rows="rows"-->
            <!--:async="asyncCall"-->
            <!--:totalRows="25"-->
        <!--&gt;-->
        <!--</vue-ads-table-tree>-->

        <!--<vue-ads-table-tree-->
            <!--:columns="columns"-->
            <!--:rows="rows"-->
            <!--:async="asyncCall"-->
        <!--&gt;-->
        <!--</vue-ads-table-tree>-->

        <!--<vue-ads-table-tree-->
            <!--:columns="columns"-->
            <!--:rows="rows"-->
        <!--&gt;-->
        <!--</vue-ads-table-tree>-->
  </div>
</template>

<script>
import '../node_modules/@fortawesome/fontawesome-free/css/all.css';
import VueAdsTableTree from './components/TableTree';
import VueAdsPagination, { VueAdsPageButton } from '../node_modules/vue-ads-pagination/dist/vue-ads-pagination.common';
import debounce from './services/debounce';

// todo styling on row

export default {
    name: 'app',

    components: {
        VueAdsTableTree,
        VueAdsPagination,
        VueAdsPageButton,
    },

    data () {
        return {
            page: 0,
            start: 0,
            end: 0,
            filterValue: '',
            debounceFilter: debounce(e => { this.filterValue = e.target.value; }, 500),
            classes: {
                'table': {
                    'vue-ads-border': true,
                    'vue-ads-w-full': true,
                },
                'info': {
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
                    firstName: 'Jef',
                    lastName: 'Vandenhende',
                    showChildren: false,
                    classes: {
                        'row': {
                            'vue-ads-text-red': true,
                        },
                    },
                    children: [
                        {
                            firstName: 'Jane',
                            lastName: 'Delanghe',
                            showChildren: false,
                            children: [
                                {
                                    firstName: 'Hendrik',
                                    lastName: 'Eeckhout',
                                    classes: {
                                        'row': {
                                            'vue-ads-text-red': true,
                                        },
                                        '0_1': {
                                            'vue-ads-font-bold': true,
                                        },
                                    },
                                },
                                {
                                    firstName: 'Bert',
                                    lastName: 'De Smedt',
                                },
                            ],
                        },
                        {
                            firstName: 'Bart',
                            lastName: 'Delanghe',
                        },
                    ],
                },
                {
                    firstName: 'Alice',
                    lastName: 'De Smedt',
                    hasChildren: true,
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
        async asyncCall (filter, sortColumns, start, end, parent) {
            await this.sleep(3000);

            let startRows = this.rows;
            if (parent) {
                startRows = this.rows.slice(3, 5);
            }

            let filteredRows = this.filter(startRows, filter);
            let sortedRows = this.sort(filteredRows, sortColumns);

            let diff = start - (start % 10);
            let rows = parent ? sortedRows : sortedRows.slice(start % 10, end - diff);

            return {
                // total: filter ? filteredRows.length : 25,
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

        pageChange (page, start, end) {
            if (page !== this.page) {
                this.page = page;
            }
            if (start !== this.start) {
                this.start = start;
            }
            if (end !== this.end) {
                this.end = end;
            }
        },
    },
};
</script>
