<template>
    <div
        id="app"
    >
        <vue-ads-table-tree
            :columns="columns"
            :rows="rows"
            :filter="filter"
            :page="page"
            :call-rows="callRows"
            :call-temp-rows="callTempRows"
            :call-children="callChildren"
            @page-change="pageChanged"
            @filter-change="filterChanged"
        >
        </vue-ads-table-tree>
    </div>
</template>

<script>
import './assets/css/tailwind.css';
import '../node_modules/@fortawesome/fontawesome-free/css/all.css';

import VueAdsTableTree from './components/TableContainer';

export default {
    name: 'AsyncTableApp',

    components: {
        VueAdsTableTree,
    },

    data () {
        let rows = [
            {
                _id: 'tiger',
                name: 'Tiger Nixon',
                function: 'System Architect',
                city: 'Edinburgh',
                id: '5421',
                since: '2011/04/25',
                budget: '$320,800',
                _hasChildren: true,
            },
            {
                name: 'Garrett Winters',
                function: 'Accountant',
                city: 'Tokyo',
                id: '8422',
                since: '2011/07/25',
                budget: '$170,750',
            },
            {
                name: 'Ashton Cox',
                function: 'Junior Technical Author',
                city: 'San Francisco',
                id: '1562',
                since: '2009/01/12',
                budget: '$86,000',
            },
            {
                name: 'Cedric Kelly',
                function: 'Senior Javascript Developer',
                city: 'Edinburgh',
                id: '6224',
                since: '2012/03/29',
                budget: '$433,060',
            },
            {
                name: 'Airi Satou',
                function: 'Accountant',
                city: 'Tokyo',
                id: '5407',
                since: '2008/11/28',
                budget: '$162,700',
            },
            {
                name: 'Brielle Williamson',
                function: 'Integration Specialist',
                city: 'New York',
                id: '4804',
                since: '2012/12/02',
                budget: '$372,000',
            },
            {
                name: 'Herrod Chandler',
                function: 'Sales Assistant',
                city: 'San Francisco',
                id: '9608',
                since: '2012/08/06',
                budget: '$137,500',
            },
            {
                name: 'Rhona Davidson',
                function: 'Integration Specialist',
                city: 'Tokyo',
                id: '6200',
                since: '2010/10/14',
                budget: '$327,900',
            },
            {
                name: 'Colleen Hurst',
                function: 'Javascript Developer',
                city: 'San Francisco',
                id: '2360',
                since: '2009/09/15',
                budget: '$205,500',
            },
            {
                name: 'Sonya Frost',
                function: 'Software Engineer',
                city: 'Edinburgh',
                id: '1667',
                since: '2008/12/13',
                budget: '$103,600',
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
            },
        ];

        rows.length = 20;

        return {
            rows,
            columns,
            filter: '',
            page: 0,
        };
    },

    methods: {
        filterChanged (filter) {
            this.filter = filter;
        },

        pageChanged (page) {
            this.page = page;
        },

        sleep (ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        async callRows (indexesToLoad) {
            await this.sleep(1000);
            return indexesToLoad.map(index => {
                return {
                    name: 'Call Rows',
                    function: 'Developer',
                    city: 'San Francisco',
                    id: '8196',
                    since: '2010/07/14',
                    budget: '$86,500',
                };
            });
        },

        async callChildren (parent) {
            await this.sleep(1000);
            return [
                {
                    name: 'Call child',
                    function: 'Developer',
                    city: 'San Francisco',
                    id: '8196',
                    since: '2010/07/14',
                    budget: '$86,500',
                },
            ];
        },

        async callTempRows (filter, columns, start, end) {
            await this.sleep(1000);
            return {
                rows: [
                    {
                        name: 'Temp call',
                        function: 'Developer',
                        city: 'San Francisco',
                        id: '8196',
                        since: '2010/07/14',
                        budget: '$86,500',
                    },
                    {
                        name: 'Temp call',
                        function: 'Developer',
                        city: 'San Francisco',
                        id: '8196',
                        since: '2010/07/14',
                        budget: '$86,500',
                    },
                    {
                        name: 'Temp call',
                        function: 'Developer',
                        city: 'San Francisco',
                        id: '8196',
                        since: '2010/07/14',
                        budget: '$86,500',
                    },
                    {
                        name: 'Temp call',
                        function: 'Developer',
                        city: 'San Francisco',
                        id: '8196',
                        since: '2010/07/14',
                        budget: '$86,500',
                    },
                    {
                        name: 'Temp call',
                        function: 'Developer',
                        city: 'San Francisco',
                        id: '8196',
                        since: '2010/07/14',
                        budget: '$86,500',
                    },
                    {
                        name: 'Temp call',
                        function: 'Developer',
                        city: 'San Francisco',
                        id: '8196',
                        since: '2010/07/14',
                        budget: '$86,500',
                    },
                    {
                        name: 'Temp call',
                        function: 'Developer',
                        city: 'San Francisco',
                        id: '8196',
                        since: '2010/07/14',
                        budget: '$86,500',
                    },
                    {
                        name: 'Temp call',
                        function: 'Developer',
                        city: 'San Francisco',
                        id: '8196',
                        since: '2010/07/14',
                        budget: '$86,500',
                    },
                    {
                        name: 'Temp call',
                        function: 'Developer',
                        city: 'San Francisco',
                        id: '8196',
                        since: '2010/07/14',
                        budget: '$86,500',
                    },
                    {
                        name: 'Temp call',
                        function: 'Developer',
                        city: 'San Francisco',
                        id: '8196',
                        since: '2010/07/14',
                        budget: '$86,500',
                    },
                ],
                total: 20,
            };
        },
    },
};
</script>
