<template>
    <div
        id="app"
        class="m-6"
    >
        <div class="mb-6">
            <vue-ads-table-tree
                :columns="columns"
                :rows="rows"
                :filter="filterValue"
                @filter-change="filterChange"
                :async-children="callChildren"
                :async="call"
                :total-rows="100"
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
            </vue-ads-table-tree>
        </div>
    </div>
</template>

<script>
import './assets/css/tailwind.css';
import '../node_modules/@fortawesome/fontawesome-free/css/all.css';
import VueAdsTableTree from './components/TableTree';

// todo add possibility to add an _id to the row. If it's set. you can combine the column name with the id to template a specific cell
// todo update the readme
// todo add tests

export default {
    name: 'App',

    components: {
        VueAdsTableTree,
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
                    direction: null,
                    filterable: true,
                },
                {
                    property: 'lastName',
                    title: 'Last Name',
                    direction: null,
                    filterable: true,
                },
            ],
            rows: [
                {
                    firstName: 'Boudewijn',
                    lastName: 'Van Brabandt',
                    _hasChildren: true,
                },
                {
                    firstName: 'Albert II',
                    lastName: 'Van Belgie',
                    _children: [
                        {
                            firstName: 'Filip',
                            lastName: 'Van Belgie',
                            _children: [
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
                                    _hasChildren: true,
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
                    _children: [
                        {
                            firstName: 'Alexander Junior',
                            lastName: 'Van Belgie',
                        },
                    ],
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
        async call (filter, sortColumns, start, end) {
            await this.sleep(1000);

            return Array.from(Array(end - start)).map(item => {
                return {
                    firstName: 'test',
                    lastName: 'called',
                };
            });
        },

        async callChildren (parent) {
            await this.sleep(1000);

            return [
                {
                    firstName: 'test',
                    lastName: 'called',
                },
            ];
        },

        sleep (ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        filterChange (filter) {
            this.filterValue = filter;
        },
    },
};
</script>
