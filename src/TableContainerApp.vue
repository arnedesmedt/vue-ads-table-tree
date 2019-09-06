<template>
    <div
        id="app"
    >
        <vue-ads-table
            :columns="columns"
            :rows="rows"
            :filter="filter"
            :page="page"
            @filter-change="filterChanged"
            @page-change="pageChanged"
            :call-rows="callRows"
            :call-children="callChildren"
            :call-temp-rows="callTempRows"
            export-name="test"
            :selection="selection"
            @selection-change="selectionChanged"
        >
            <!--&lt;!&ndash; Will be applied on the name column for the rows with an _id of tiger &ndash;&gt;-->
            <!--<template slot="name_tiger" slot-scope="props">test cell - {{ props.row[props.column.property] }}</template>-->
            <!--&lt;!&ndash; Will be applied on the city column &ndash;&gt;-->
            <!--<template slot="city" slot-scope="props">test column - {{ props.row.city }}</template>-->
            <!--&lt;!&ndash; Will be applied on the row with _id tiger &ndash;&gt;-->
            <!--<template slot="_tiger" slot-scope="props">test row - {{ props.row[props.column.property] }}</template>-->
            <!--<template slot="no-rows">Geen resultaten</template>-->
            <!--<template slot="sort-icon" slot-scope="props">{{ props.direction === null ? 'null' : (props.direction ? 'up' : 'down') }}</template>-->
            <!--<template slot="toggle-children-icon" slot-scope="props">{{ props.expanded ? 'open' : 'closed' }}</template>-->
        </vue-ads-table>
        <div v-if="selection" class="p-2 vue-ads-text-sm">
            Selected IDs: {{selectedLineIds}}
            <br>
            Sample action:
            <button
                type="button"
                class="vue-ads-text-white vue-ads-p-1 vue-ads-cursor-pointer vue-ads-rounded-sm"
                :class="[nothingSelected ? 'bg-gray-500' : 'vue-ads-bg-teal-500']"
                :disabled="nothingSelected"
                @click="deleteRows"
            > Delete
            </button>
        </div>
    </div>
</template>

<script>
import './assets/css/tailwind.css';
import '../node_modules/@fortawesome/fontawesome-free/css/all.css';

import VueAdsTable from './components/TableContainer';

export default {
    name: 'TableContainerApp',

    components: {
        VueAdsTable,
    },

    data () {
        let rows = [
            {
                _id: 'tiger',
                name: 'Tiger Nixon',
                function: 'Office Manager',
                city: 'Edinburgh',
                id: '5421',
                since: '2011/04/25',
                budget: 320800,
                _children: [
                    {
                        name: 'Garrett Winters',
                        function: 'Accountant',
                        city: 'Tokyo',
                        id: '8422',
                        since: '2011/07/25',
                        budget: 170750,
                    },
                    {
                        name: 'Airi Satou',
                        function: 'Accountant',
                        city: 'Tokyo',
                        id: '5407',
                        since: '2008/11/28',
                        budget: 162700,
                        _showChildren: true,
                        _children: [
                            {
                                name: 'Gloria Little',
                                function: 'Systems Administrator',
                                city: 'New York',
                                id: '1721',
                                since: '2009/04/10',
                                budget: 237500,
                            },
                            {
                                name: 'Bradley Greer',
                                function: 'Software Engineer',
                                city: 'London',
                                id: '2558',
                                since: '2012/10/13',
                                budget: 132000,
                            },
                        ],
                    },
                    {
                        name: 'Ashton Cox',
                        function: 'Junior Technical Author',
                        city: 'San Francisco',
                        id: '1562',
                        since: '2009/01/12',
                        budget: 86000,
                    },
                ],
            },
            {
                name: 'Garrett Winters',
                function: 'Accountant',
                city: 'Tokyo',
                id: '8422',
                since: '2011/07/25',
                budget: 170750,
                _hasChildren: false,
            },
            {
                name: 'Ashton Cox',
                function: 'Junior Technical Author',
                city: 'San Francisco',
                id: '1562',
                since: '2009/01/12',
                budget: 86000,
            },
            {
                name: 'Cedric Kelly',
                function: 'Office Manager',
                city: 'Edinburgh',
                id: '6224',
                since: '2012/03/29',
                budget: 433060,
            },
            {
                name: 'Airi Satou',
                function: 'Accountant',
                city: 'Tokyo',
                id: '5407',
                since: '2008/11/28',
                budget: 162700,
            },
            {
                name: 'Brielle Williamson',
                function: 'Integration Specialist',
                city: 'New York',
                id: '4804',
                since: '2012/12/02',
                budget: 372000,
            },
            {
                name: 'Herrod Chandler',
                function: 'Office Manager',
                city: 'San Francisco',
                id: '9608',
                since: '2012/08/06',
                budget: 137500,
            },
            {
                name: 'Rhona Davidson',
                function: 'Integration Specialist',
                city: 'Tokyo',
                id: '6200',
                since: '2010/10/14',
                budget: 327900,
            },
            {
                name: 'Colleen Hurst',
                function: 'Integration Specialist',
                city: 'San Francisco',
                id: '2360',
                since: '2009/09/15',
                budget: 205500,
            },
            {
                name: 'Sonya Frost',
                function: 'Office Manager',
                city: 'Edinburgh',
                id: '1667',
                since: '2008/12/13',
                budget: 103600,
            },
            {
                name: 'Unity Butler',
                function: 'Accountant',
                city: 'San Francisco',
                id: '5384',
                since: '2009/12/09',
                budget: 85675,
            },
            {
                name: 'Howard Hatfield',
                function: 'Office Manager',
                city: 'San Francisco',
                id: '7031',
                since: '2008/12/16',
                budget: 164500,
            },
            {
                name: 'Hope Fuentes',
                function: 'Integration Specialist',
                city: 'San Francisco',
                id: '6318',
                since: '2010/02/12',
                budget: 109850,
            },
            {
                name: 'Vivian Harrell',
                function: 'Accountant',
                city: 'San Francisco',
                id: '9422',
                since: '2009/02/14',
                budget: 452500,
            },
        ];
        let columns = [
            {
                property: 'id',
                title: 'ID#',
                direction: null,
                filterable: true,
            },
            {
                property: 'name',
                title: 'Name',
                direction: null,
                filterable: true,
            },
            {
                property: 'function',
                title: 'Function',
                direction: null,
                filterable: true,
                groupable: true,
                groupCollapsable: true,
                hideOnGroup: true,
            },
            {
                property: 'city',
                title: 'City',
                direction: null,
                filterable: true,
            },
            {
                property: 'since',
                title: 'Since',
                direction: null,
                filterable: true,
            },
            {
                property: 'budget',
                title: 'Budget',
                direction: null,
                filterable: true,
                groupable: true,
                groupBy: (budget) => {
                    if (budget < 100000) {
                        return '< 100 000';
                    } else if (budget < 200000) {
                        return '< 200 000';
                    } else if (budget < 300000) {
                        return '< 300 000';
                    } else if (budget < 400000) {
                        return '< 400 000';
                    } else {
                        return '> 400 000';
                    }
                },
            },
        ];

        return {
            rows,
            columns,
            filter: '',
            page: 0,
            selection: true,
            selectedLineIds: [],
        };
    },

    computed: {
        nothingSelected () {
            return this.selectedLineIds.length === 0;
        },
    },

    methods: {
        sleep (ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        filterChanged (filter) {
            this.filter = filter;
        },

        pageChanged (page) {
            this.page = page;
        },

        selectionChanged (rows) {
            this.selectedLineIds = rows.map(row => {
                return row.id;
            });
        },

        async callRows (indexesToLoad) {
            await this.sleep(1000);

            return indexesToLoad.map(index => {
                return {
                    name: 'Herrod Chandler',
                    function: 'Sales Assistant',
                    city: 'San Francisco',
                    id: '9608',
                    since: '2012/08/06',
                    budget: 137500,
                };
            });
        },

        async callChildren (parent) {
            await this.sleep(1000);
            return [
                {
                    name: 'Jonas Alexander',
                    function: 'Developer',
                    city: 'San Francisco',
                    id: '8196',
                    since: '2010/07/14',
                    budget: 86500,
                },
            ];
        },

        async callTempRows () {
            await this.sleep(1000);

            return {
                rows: [],
                total: 0,
            };
        },

        deleteRows () {
            let me = this;
            this.rows = delRows(this.rows);
            function delRows (rows) {
                return rows.filter(row => {
                    if (row._children && row._children.length) {
                        row._children = delRows(row._children);
                    }
                    return me.selectedLineIds.indexOf(row.id) === -1;
                });
            }
        },
    },
};
</script>
