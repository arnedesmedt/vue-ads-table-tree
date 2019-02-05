# vue-ads-table-tree

Vue ads table tree is a vue js table component, with a tree functionality.

The default features of a table component like filtering, sorting and paginating are implemented.
On top of that, you can add a tree structure: Rows can have child rows, that can be hidden or expanded.
 
Another cool feature, is the choice to load your rows in advance or via an async call to the backend.
You can even load a small part of your data, for example the first page, and then load all the other pages
with async calls to the backend.

A lot of templates are used, so you can change some parts of it.

The design of the table is fully customizable. All rows, columns, cells can be changed.
You can even apply a design for one specific row. That stays fixed after sorting the table.

The columns and rows are also reactive. The only restriction is that you can't add child rows 
after you've added them initial or via the async child loader.

You can use 3 components: 
- The basic component (VueAdsTable): It has no async features or external components like a filter box or pagination component.
- The async component (VueAdsAsyncTable): It has no external components like a filter box or pagination component.
- The full component (VueAdsTableTree).

## Demo

I've written a demo in [JSFiddle](https://jsfiddle.net/arnedesmedt/7my8L42q)

## Installation

You can install the package via npm or yarn.

#### NPM

```npm install vue-ads-table-tree --save```

#### YARN

```yarn add vue-ads-table-tree```

## Common objects for the 3 components

### <a name="columns"></a>Columns
Columns are listed in a column array as plain objects and can have the following arguments:

- `property`: *(type: string, default: `''`)* The corresponding value will be shown in the column for the given row property. 
- `title`: *(type: string, default: `''`)* The title that will be shown in the header. 
- `filterable`: *(type: boolean, default: `false`)* Is this column filterable?
- `visible`: *(type: boolean, default: `true`)* Is the column visible? Non-visible columns will not interact.
  That means if your column is filterable/sortable but not visible it won't filter or sort on it. 
- `direction`: *(type: boolean or null, default: `null`)* The initial sort direction. If null, the rows are not sorted by this column. 
  If true, the sorting is ascending. If false, the sorting is descending. If all columns are null the rows will be 
  sorted based on their `_order` value.
- `order`: *(type: number)* Column order to sort the rows. 
- `collapseIcon`: *(type: boolean, default: `false`)* Indicates if this column will contain the collapse icon.

### <a name="rows"></a>Rows
Rows are listed in a row array as plain objects. Each object contains the row data and meta data. Meta data is prefixed with a `_`:
- `_id`: *(type: string, default: `''`)* An identifier for this row. This is used to create slots for certain cells on the row.
- `_children`: *(type: array, default: `[]`)* An array with plain child objects. The structure is the same as the parent list of rows.
- `_hasChildren`: *(type: boolean, default: `false`)* This is usefull if you want to indicate that the row has children, but you will load them later via an async call.
- `_showChildren`: *(type: boolean, default: `false`)* Indicates if the children has to be shown on initialization.
  If this is true, and `_hasChildren` is true, but no `_children` attribute is found, an async call will be initiated to call the children.
- `_classes`: *(type: Object, default: `{}`)* Contains styling for the current row. It contains the following attributes:
    - `row`: *(type: Object)* A vue based object for adding classes.
    - `<column-selector>`: *(type: Object)* A vue based object for adding classes. The column selector works as explained in [styling](#styling),
      without the use of slashes to distinguish columns and rows.

### <a name="styling"></a>Styling
All styling is done via a plain object. It contains a selector for a row/column/cell as key and a vue based object that contains classes.
The latter ones can override the earlier ones:
- The key is a selector. You have two type of selectors: fixed selectors and row/column/cell selectors:
    - fixed selectors: use the preserver words `table` or `info` to style the whole table or to style the info row 
    (shown while loading or no rows are found).
    - row/column/cell selectors: These selectors are divided by a slash. So you can have a row selector and a column selector. 
    The header row has index 0. The first data row has index 1. Some examples:
        - 'all': select all rows/columns.
        - 'even': select all even rows/columns.
        - 'odd': select all odd rows/columns.
        - '3': select row/column with index 3,
        - '5_7': select row/column 5 and 6,
        - '0_-1': select all rows/columns except the last one.
        - '1_': select all rows/columns except the first one.
        - '_4': select rows/columns 0,1,2,3.
        - '1_4,5_8': select rows/columns 1,2,3,5,6,7
- The value is a vue based class object.
- Note that there is a difference between `1_3/all` and `1_3/`. The first will add the classes to all the cells of row 1 and 2.
The latter will add the classes on the `<tr>` tags of row 1 and 2.

#### Examples 
- `'0_-1/': {'test-row': true}` => will add the test class for all rows except the last one for all columns. 
- `'/1_3,5': {'test-column': true}` => will add the test-column class for column 1,2,5 on all rows.
- `'even/1': {'cell': true}` => will add the cell class for column 1 on all even rows.

## Basic table component

If you won't need any async loading of table data, you can use the basic table. It won't provide you a paginator,
filter textbox, ... It's just a Vue component and all interaction happens via the properties or event handlers.

If you want to use the basic table in a predefined container with a paginator, filter textbox see the [table container section](#tableContainer)

### Properties

- `columns`: *(type: array, required)* see [columns](#columns)
- `rows`: *(type: array, default: `[]`)* see [rows](#rows)
- `classes`: *(type: object, default: see [file](../src/services/defaultClasses.js))* see [styling](#styling)
- `filter`: *(type: string, default: `''`)* Filter all row values on by this regex. Beware that if you change the filter,
the total number of rows will decrease. So it's wisely to set the start index on 0 after you change the filter value.
Then you will be able to properly display all the filtered rows.
- `start`: *(type: number, default: `undefined`)* The start index to show only a slice of the rows.
- `end`: *(type: number, default: `undefined`)* The end index to show only a slice of the rows.
- `slots`: *(type: Object, default: {})* A list of slots that are passed from parent components.
If this object doesn't contain any attributes, the default component slots will be used.
- `loading`: *(type: boolean, default: false)* Indicates if the rows are loading.
- `temp`: *(type: boolean, default: false)* Indicates if the current rows are temporarily. 
If so, the rows will not be filtered, sorted or paginated.

Start and end using the Array.slice method to show only a part of the rows. If you don't add them as properties, 
their value will ben undefined and all the rows will be visible.

### <a name="basic_table_events"></a>Events

- `total-filtered-rows-change`: This event will be triggered if due to filtering the total amount of rows changes. 
It contains one parameter:
    - `total`: *(type: Number)* The total number of filtered rows.
- `sort`: This event will be triggered if a column is sorted. It also contains one parameter:
    - `sortColummns`: *(type: array)* A list of all the columns who are sorting order by sorting order.
- `toggle-children`: This event is triggered if the children of a row expand or collapse. It contains one parameter:
    - `row`: *(type: Object)* This is the parent row object.


### <a name="basic_table_slots"></a>Slots

#### 1. Row/Column/Cell slot

If you want to use your own template for all cells in a row, for all cells in a column or for a specific cell,
you can use your own scoped slot with the following names (the first will overrule the latter):
- `<column_property>_<row_id>`: Replace a specific cell for the column `<column_property>` (assigned by the `property` attribute in the column object) 
and row `<row_id>` (assigned by the `_id` attibute in the row object).
- `<column_proerty>`: Replace all column cells for the column `<column_property>` (assigned by the `property` attribute in the column object).
- `_<row_id>`: Replace all row cells for the row `<row_id>` (assigned by the `_id` attibute in the row object).

All three contains a slot-scope which contains the following parameters:
- `row`: The row object.
- `column`: The column object.

#### 2. No rows slot

If no rows are loaded, the table displays 'No results found.'. You can replace this message by the scoped slot `no-rows`.

#### 3. Sort icon slot

If you want to customize the sort icon add a scoped slot with the name `sort-icon`.
The scope contains only one parameter:

- `direction`: *(type: boolean or null)* The direction is null if the column is not sorted, true if it's sorted asc and false if it's sorted desc.

#### 4. Toggle children icon slot

If you want to customize the toggle children icon add a scoped slot with the name `toggle-children-icon`.
The scope contains two parameters:

- `expanded`: *(type: boolean)* Indicates if the children are visible or not.
- `loading`: *(type: boolean)* Indicates if the chilrend are currently loading.

### Example

```vue
<template>
    <div id="app">
        <vue-ads-table
            :columns="columns"
            :rows="rows"
            :classes="classes"
            :filter="filter"
            :start="start"
            :end="end"
        >
            <!-- Will be applied on the name column for the rows with an _id of tiger -->
            <template slot="name_tiger" slot-scope="props">test cell - {{ props.row.name }}</template>
            <!-- Will be applied on the city column -->
            <template slot="city" slot-scope="props">test column - {{ props.row.city }}</template>
            <!-- Will be applied on the row with _id tiger -->
            <template slot="_tiger" slot-scope="props">test row - {{ props.row[props.column.property] }}</template>
            <template slot="no-rows">Geen resultaten</template>
            <template slot="sort-icon" slot-scope="props">{{ props.direction === null ? 'null' : (props.direction ? 'up' : 'down') }}</template>
            <template slot="toggle-children-icon" slot-scope="props">{{ props.expanded ? 'open' : 'closed' }}</template>
        </vue-ads-table>
    </div>
</template>

<script>
import { VueAdsTable } from 'vue-ads-table-tree';

export default {
    name: 'BasicTableApp',

    components: {
        VueAdsTable,
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
                ],
            },
            {
                name: 'Lael Greer',
                function: 'Systems Administrator',
                city: 'London',
                id: '6733',
                since: '2009/02/27',
                budget: '$103,500',
                _showChildren: true,
                _children: [
                    {
                        name: 'Garrett Winters',
                        function: 'Accountant',
                        city: 'Tokyo',
                        id: '8422',
                        since: '2011/07/25',
                        budget: '$170,750',
                    },
                ],
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
        
        let classes = {
            '0/all': {
                'vue-ads-py-3': true,
                'vue-ads-px-2': true,
            },
            'even/': {
                'vue-ads-bg-blue-lighter': true,
            },
            'odd/': {
                'vue-ads-bg-blue-lightest': true,
            },
            '0/': {
                'vue-ads-bg-blue-lighter': false,
                'vue-ads-bg-blue-dark': true,
                'vue-ads-text-white': true,
                'vue-ads-font-bold': true,
            },
            '1_/': {
                'hover:vue-ads-bg-red-lighter': true,
            },
        };

        return {
            rows,
            columns,
            classes,
            filter: '',
            start: 0,
            end: 2,
        };
    },
};
</script>
```

## Async table component

The async table is used to load data asynchronously. If you don't want to load all the root rows in one time, 
but per page. Or you want to load your child rows only when the user clicks the 'toggle-children'-button. 
Then you can use the async table.

You will get all the features of the basic table but there are some extra additions:

### Load your root rows asynchronously

In previous versions of the table tree, you needed to pass the total rows as a property. Now, you don't need
that anymore. Just change the length of the rows array. For example you already have 3 root rows in your JSON array,
but you want to load another 3 root rows asynchronously, well then set the length of your rows property to 6: `this.rows.length = 6`.
Don't forget to add the `call-rows` property to your component. See [Async properties](#async_properties)

### Load your child rows asynchronously

If you want to load your child rows later, just add the `_hasChildren` attribute to your row with `true` as value.
It will add a toggle children icon and when you click it, the children will be loaded. 
Don't forget to add the `call-children` property to your component. See [Async properties](#async_properties)

### Sort or filter on a not fully loaded table

If you're sorting/filtering while not all root/child rows are loaded. There is a small problem. We don't know if your sort
or filter result will be the right one, because not all the data is loaded.
Therefore the component will call the `call-temp-rows` function you need to pass via the property. See [Async properties](#async_properties)

Be aware that the result of the function call is send to the table without any additional filtering, sorting or pagination.
The rows will only expand if needed. You can see it as you pass temporarily rows to the table 

### <a name="async_properties"></a>Aync properties

You can use the `columns`, `rows`, `filter`, `classes`, `start`, `end` and `slots` properties from the base table. 
But their are some additional properties:

- `call-rows`: *(type: Function, default: `() => []`)* This function will be called if additional root rows needs to  be loaded.
It will give you only one parameter:
    - `indexes`: *(type: array)* A list of indexes in the rows array you need to load. 
    If you're sure all the items needs to be loaded, just take the first and last one and use them as a paramter.
    But in some cases, some rows will already been loaded. That's the reason why a list is taken instead of
    the first and last one.
- `call-children`: *(type: Function, default: `() => []`)* This function will be called if child rows needs to  be loaded.
All child rows has to be loaded at once. There is no possibility to load a part of it later.It will give you only one parameter:
    - `parent`: *(type: Object)* The parent row that needs children.
- `call-temp-rows`: *(type: Function, default: `() => []`)* The function will be called if the table is sorted and not all 
root rows are loaded or the table is filtered and not all root rows or child rows are loaded. The following parameters are passed to the function:
    - `filter`: *(type: string)* The current filter.
    - `sortColumns`: *(type: array)* The list of currently sorted columns ordered by sorting order.
    - `start`: *(type: Number)* The current start index, used for pagination.
    - `end`: *(type: Number)* The current end index, used for pagination.
    
    You need to return an simple javascript object with the following attributes:
    - `rows`: *(type: array)* A list of founded rows for the current parameters.
    - `total`: *(type: Number)* The total number of rows found with filtering and sorting, but without pagination.
    If this attribute is not set, the length of the rows attribute is taken.

### Events

The async table has only one event:

- `total-filtered-rows-change`: see [the basic table events](#basic_table_events)

### Slots

All the slots of the [basic table](#basic_table_slots) can be used.

### Example
```vue
<template>
    <div>
        <vue-ads-async-table
            :columns="columns"
            :rows="rows"
            :filter="filter"
            :start="start"
            :end="end"
            :call-rows="callRowsFunction"
            :call-children="callChildrenFunction"
            :call-temp-rows="callTempRowsFunction"
        >
            <!-- Will be applied on the name column for the rows with an _id of tiger -->
            <template slot="name_tiger" slot-scope="props">test cell - {{ props.row.name }}</template>
            <!-- Will be applied on the city column -->
            <template slot="city" slot-scope="props">test column - {{ props.row.city }}</template>
            <!-- Will be applied on the row with _id tiger -->
            <template slot="_tiger" slot-scope="props">test row - {{ props.row[props.column.property] }}</template>
            <template slot="no-rows">Geen resultaten</template>
            <template slot="sort-icon" slot-scope="props">{{ props.direction === null ? 'null' : (props.direction ? 'up' : 'down') }}</template>
            <template slot="toggle-children-icon" slot-scope="props">{{ props.expanded ? 'open' : 'closed' }}</template>
        </vue-ads-async-table>
    </div>
</template>

<script>
import { VueAdsAsyncTable } from 'vue-ads-table-tree';

export default {
    name: 'AsyncTableApp',

    components: {
        VueAdsAsyncTable,
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
                name: 'Lael Greer',
                function: 'Systems Administrator',
                city: 'London',
                id: '6733',
                since: '2009/02/27',
                budget: '$103,500',
                _showChildren: true,
                _children: [
                    {
                        name: 'Garrett Winters',
                        function: 'Accountant',
                        city: 'Tokyo',
                        id: '8422',
                        since: '2011/07/25',
                        budget: '$170,750',
                    },
                ],
            },
        ];
        
        rows.length = 4;
        
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
            start: 0,
            end: 2,
        };
    },
    
    methods: {
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
                ],
                total: 4,
            };
        },  
    },
};
</script>

```

## <a name="tableContainer"></a>Full component

The table container is the complete component it adds a filter box and and a paginator to the table.
If your `call-rows` property is not empty, an async table component will be used. If the property is empty and basic table component will be used.

### <a name="container_properties"></a>Properties

You can use the `columns`, `rows`, `filter`, `classes`, `call-rows`, `call-temp-rows` and `call-children` properties from the base and async table. 
But their are 2 additional properties:

- `debounced-filter-time`: *(type: Number, default: 500)* The time in milliseconds to wait before the input value of the filter box is used.
- `page`: *(type: Number, default: 0)* The initial page of the paginator.

### Events

The table container has 2 event:

- `filter-change`: This is used to update the filter property outside the component.
- `page-change`: This is used to update the page property outside the component.

### Slots

All the slots of the [basic table](#basic_table_slots) can be used.

And their are 2 additional slots:

#### 1. Top

A scoped slot that can be used to overwrite everything that is on the top of the table. It has the following scope:
- `filter`: *(type: string)* The filter value.
- `filterChanged`: *(type: Function)* Execute this function if the filter is changed. It will emit and filter-change and page-change event.

#### 2. Bottom

A scoped slot that can be used to overwrite everything that is on the bottom of the table. It has the following scope:
- `total`: *(type: Number)* The total amount of rows.
- `page`: *(type: Number)* The current page.
- `itemsPerPage`: *(type: Number)* The number of rows per page.
- `pageChanged`: *(type: Function)* Execute this function if the page is changed.
- `rangeChanged`: *(type: Function)* Execute this function if the range is changed.

## Testing

We use the jest framework for testing the table tree component. Run the following command to test it:

```
npm run test:unit
```

## Changelog

Read the [CHANGELOG](CHANGELOG.md) file to check what has changed.

## Issues

If you have any issues (bugs, features, ...) on the current project, add them [here](https://gitlab.com/arnedesmedt/vue-ads-table-tree/issues/new).

## Contributing

Do you like to contribute to this project? Please, read the [CONTRIBUTING](CONTRIBUTING.md) file.

## Social

[1]: http://www.twitter.com/arnesmedt
[1.1]: http://i.imgur.com/wWzX9uB.png (@ArneSmedt)
 - Follow me on [![alt text][1.1]][1]
 
## Donate

Want to make a donation? 
That would be highly appreciated!

Make a donation via [PayPal](https://www.paypal.me/arnedesmedt).
