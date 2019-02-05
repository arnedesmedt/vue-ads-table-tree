<template>
    <div
        id="app"
    >
        <vue-ads-table-tree
            :columns="columns"
            :rows="rows"
            :filter="filter"
            :page="page"
            @filter-change="filterChanged"
            @page-change="pageChanged"
        >
            <!-- Will be applied on the name column for the rows with an _id of tiger -->
            <template slot="name_tiger" slot-scope="props">test cell - {{ props.row[props.column.property] }}</template>
            <!-- Will be applied on the city column -->
            <template slot="city" slot-scope="props">test column - {{ props.row.city }}</template>
            <!-- Will be applied on the row with _id tiger -->
            <template slot="_tiger" slot-scope="props">test row - {{ props.row[props.column.property] }}</template>
            <template slot="no-rows">Geen resultaten</template>
            <template slot="sort-icon" slot-scope="props">{{ props.direction === null ? 'null' : (props.direction ? 'up' : 'down') }}</template>
            <template slot="toggle-children-icon" slot-scope="props">{{ props.expanded ? 'open' : 'closed' }}</template>
        </vue-ads-table-tree>
    </div>
</template>

<script>
import './assets/css/tailwind.css';
import '../node_modules/@fortawesome/fontawesome-free/css/all.css';

import VueAdsTableTree from './components/TableContainer';

export default {
    name: 'BasicTableApp',

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
                _children: [
                    {
                        name: 'Garrett Winters',
                        function: 'Accountant',
                        city: 'Tokyo',
                        id: '8422',
                        since: '2011/07/25',
                        budget: '$170,750',
                    },
                    {
                        name: 'Airi Satou',
                        function: 'Accountant',
                        city: 'Tokyo',
                        id: '5407',
                        since: '2008/11/28',
                        budget: '$162,700',
                        _showChildren: true,
                        _children: [
                            {
                                name: 'Gloria Little',
                                function: 'Systems Administrator',
                                city: 'New York',
                                id: '1721',
                                since: '2009/04/10',
                                budget: '$237,500',
                            },
                            {
                                name: 'Bradley Greer',
                                function: 'Software Engineer',
                                city: 'London',
                                id: '2558',
                                since: '2012/10/13',
                                budget: '$132,000',
                            },
                        ],
                    },
                    {
                        name: 'Ashton Cox',
                        function: 'Junior Technical Author',
                        city: 'San Francisco',
                        id: '1562',
                        since: '2009/01/12',
                        budget: '$86,000',
                    },
                ],
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
            {
                name: 'Jena Gaines',
                function: 'Office Manager',
                city: 'London',
                id: '3814',
                since: '2008/12/19',
                budget: '$90,560',
            },
            {
                name: 'Quinn Flynn',
                function: 'Support Lead',
                city: 'Edinburgh',
                id: '9497',
                since: '2013/03/03',
                budget: '$342,000',
            },
            {
                name: 'Charde Marshall',
                function: 'Regional Director',
                city: 'San Francisco',
                id: '6741',
                since: '2008/10/16',
                budget: '$470,600',
            },
            {
                name: 'Haley Kennedy',
                function: 'Senior Marketing Designer',
                city: 'London',
                id: '3597',
                since: '2012/12/18',
                budget: '$313,500',
            },
            {
                name: 'Tatyana Fitzpatrick',
                function: 'Regional Director',
                city: 'London',
                id: '1965',
                since: '2010/03/17',
                budget: '$385,750',
            },
            {
                name: 'Michael Silva',
                function: 'Marketing Designer',
                city: 'London',
                id: '1581',
                since: '2012/11/27',
                budget: '$198,500',
            },
            {
                name: 'Paul Byrd',
                function: 'Chief Financial Officer (CFO)',
                city: 'New York',
                id: '3059',
                since: '2010/06/09',
                budget: '$725,000',
            },
            {
                name: 'Gloria Little',
                function: 'Systems Administrator',
                city: 'New York',
                id: '1721',
                since: '2009/04/10',
                budget: '$237,500',
            },
            {
                name: 'Bradley Greer',
                function: 'Software Engineer',
                city: 'London',
                id: '2558',
                since: '2012/10/13',
                budget: '$132,000',
            },
            {
                name: 'Dai Rios',
                function: 'Personnel Lead',
                city: 'Edinburgh',
                id: '2290',
                since: '2012/09/26',
                budget: '$217,500',
            },
            {
                name: 'Jenette Caldwell',
                function: 'Development Lead',
                city: 'New York',
                id: '1937',
                since: '2011/09/03',
                budget: '$345,000',
            },
            {
                name: 'Yuri Berry',
                function: 'Chief Marketing Officer (CMO)',
                city: 'New York',
                id: '6154',
                since: '2009/06/25',
                budget: '$675,000',
            },
            {
                name: 'Caesar Vance',
                function: 'Pre-Sales Support',
                city: 'New York',
                id: '8330',
                since: '2011/12/12',
                budget: '$106,450',
            },
            {
                name: 'Doris Wilder',
                function: 'Sales Assistant',
                city: 'Sidney',
                id: '3023',
                since: '2010/09/20',
                budget: '$85,600',
            },
            {
                name: 'Angelica Ramos',
                function: 'Chief Executive Officer (CEO)',
                city: 'London',
                id: '5797',
                since: '2009/10/09',
                budget: '$1,200,000',
            },
            {
                name: 'Gavin Joyce',
                function: 'Developer',
                city: 'Edinburgh',
                id: '8822',
                since: '2010/12/22',
                budget: '$92,575',
            },
            {
                name: 'Jennifer Chang',
                function: 'Regional Director',
                city: 'Singapore',
                id: '9239',
                since: '2010/11/14',
                budget: '$357,650',
            },
            {
                name: 'Brenden Wagner',
                function: 'Software Engineer',
                city: 'San Francisco',
                id: '1314',
                since: '2011/06/07',
                budget: '$206,850',
            },
            {
                name: 'Fiona Green',
                function: 'Chief Operating Officer (COO)',
                city: 'San Francisco',
                id: '2947',
                since: '2010/03/11',
                budget: '$850,000',
            },
            {
                name: 'Shou Itou',
                function: 'Regional Marketing',
                city: 'Tokyo',
                id: '8899',
                since: '2011/08/14',
                budget: '$163,000',
            },
            {
                name: 'Michelle House',
                function: 'Integration Specialist',
                city: 'Sidney',
                id: '2769',
                since: '2011/06/02',
                budget: '$95,400',
            },
            {
                name: 'Suki Burks',
                function: 'Developer',
                city: 'London',
                id: '6832',
                since: '2009/10/22',
                budget: '$114,500',
            },
            {
                name: 'Prescott Bartlett',
                function: 'Technical Author',
                city: 'London',
                id: '3606',
                since: '2011/05/07',
                budget: '$145,000',
            },
            {
                name: 'Gavin Cortez',
                function: 'Team Leader',
                city: 'San Francisco',
                id: '2860',
                since: '2008/10/26',
                budget: '$235,500',
            },
            {
                name: 'Martena Mccray',
                function: 'Post-Sales support',
                city: 'Edinburgh',
                id: '8240',
                since: '2011/03/09',
                budget: '$324,050',
            },
            {
                name: 'Unity Butler',
                function: 'Marketing Designer',
                city: 'San Francisco',
                id: '5384',
                since: '2009/12/09',
                budget: '$85,675',
            },
            {
                name: 'Howard Hatfield',
                function: 'Office Manager',
                city: 'San Francisco',
                id: '7031',
                since: '2008/12/16',
                budget: '$164,500',
            },
            {
                name: 'Hope Fuentes',
                function: 'Secretary',
                city: 'San Francisco',
                id: '6318',
                since: '2010/02/12',
                budget: '$109,850',
            },
            {
                name: 'Vivian Harrell',
                function: 'Financial Controller',
                city: 'San Francisco',
                id: '9422',
                since: '2009/02/14',
                budget: '$452,500',
            },
            {
                name: 'Timothy Mooney',
                function: 'Office Manager',
                city: 'London',
                id: '7580',
                since: '2008/12/11',
                budget: '$136,200',
            },
            {
                name: 'Jackson Bradshaw',
                function: 'Director',
                city: 'New York',
                id: '1042',
                since: '2008/09/26',
                budget: '$645,750',
            },
            {
                name: 'Olivia Liang',
                function: 'Support Engineer',
                city: 'Singapore',
                id: '2120',
                since: '2011/02/03',
                budget: '$234,500',
            },
            {
                name: 'Bruno Nash',
                function: 'Software Engineer',
                city: 'London',
                id: '6222',
                since: '2011/05/03',
                budget: '$163,500',
            },
            {
                name: 'Sakura Yamamoto',
                function: 'Support Engineer',
                city: 'Tokyo',
                id: '9383',
                since: '2009/08/19',
                budget: '$139,575',
            },
            {
                name: 'Thor Walton',
                function: 'Developer',
                city: 'New York',
                id: '8327',
                since: '2013/08/11',
                budget: '$98,540',
            },
            {
                name: 'Finn Camacho',
                function: 'Support Engineer',
                city: 'San Francisco',
                id: '2927',
                since: '2009/07/07',
                budget: '$87,500',
            },
            {
                name: 'Serge Baldwin',
                function: 'Data Coordinator',
                city: 'Singapore',
                id: '8352',
                since: '2012/04/09',
                budget: '$138,575',
            },
            {
                name: 'Zenaida Frank',
                function: 'Software Engineer',
                city: 'New York',
                id: '7439',
                since: '2010/01/04',
                budget: '$125,250',
            },
            {
                name: 'Zorita Serrano',
                function: 'Software Engineer',
                city: 'San Francisco',
                id: '4389',
                since: '2012/06/01',
                budget: '$115,000',
            },
            {
                name: 'Jennifer Acosta',
                function: 'Junior Javascript Developer',
                city: 'Edinburgh',
                id: '3431',
                since: '2013/02/01',
                budget: '$75,650',
            },
            {
                name: 'Cara Stevens',
                function: 'Sales Assistant',
                city: 'New York',
                id: '3990',
                since: '2011/12/06',
                budget: '$145,600',
            },
            {
                name: 'Hermione Butler',
                function: 'Regional Director',
                city: 'London',
                id: '1016',
                since: '2011/03/21',
                budget: '$356,250',
            },
            {
                name: 'Lael Greer',
                function: 'Systems Administrator',
                city: 'London',
                id: '6733',
                since: '2009/02/27',
                budget: '$103,500',
            },
            {
                name: 'Jonas Alexander',
                function: 'Developer',
                city: 'San Francisco',
                id: '8196',
                since: '2010/07/14',
                budget: '$86,500',
            },
            {
                name: 'Shad Decker',
                function: 'Regional Director',
                city: 'Edinburgh',
                id: '6373',
                since: '2008/11/13',
                budget: '$183,000',
            },
            {
                name: 'Michael Bruce',
                function: 'Javascript Developer',
                city: 'Singapore',
                id: '5384',
                since: '2011/06/27',
                budget: '$183,000',
            },
            {
                name: 'Donna Snider',
                function: 'Customer Support',
                city: 'New York',
                id: '4226',
                since: '2011/01/25',
                budget: '$112,000',
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
    },
};
</script>
