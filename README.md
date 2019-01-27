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
after you've added them initial or via the async child loader

## Demo

I've written a demo in [JSFiddle](https://jsfiddle.net/arnedesmedt/7my8L42q)

## Installation

You can install the package via npm or yarn.

#### NPM

```npm install vue-ads-table-tree --save```

#### YARN

```yarn add vue-ads-table-tree```

## Usage

You can add the vue-ads-table-tree component by using the following code in your project.
This is a very simple example.

```vue
<template>
    <div id="app">
        <vue-ads-table-tree
            :columns="columns"
            :rows="rows"
        >
            <template slot="title">
                <h2>
                    My own title
                </h2>
            </template>
            <template slot="firstName" slot-scope="props">
                <a :href="`https://www.google.com/search?q=${props.row.firstName}+${props.row.lastName}`" target="_blank">{{props.row.firstName}}</a>
            </template>
        </vue-ads-table-tree>
  </div>
</template>

<script>
import '../node_modules/@fortawesome/fontawesome-free/css/all.css';
import '../node_modules/vue-ads-table-tree/dist/vue-ads-table-tree.css';

import VueAdsTableTree from 'vue-ads-table-tree';

export default {
    name: 'app',

    components: {
        VueAdsTableTree,
    },

    data () {
        return {
            columns: [
                {
                    property: 'firstName',
                    title: 'First Name',
                    direction: null,
                    filterable: true,
                    visible: false,
                },
                {
                    property: 'lastName',
                    title: 'Last Name',
                    filterable: true,
                    direction: null,
                    collapseIcon: true,
                },
            ],
            rows: [
                {
                    firstName: 'Albert',
                    lastName: 'Einstein',
                },
                {
                    firstName: 'Barack',
                    lastName: 'Obama',
                },
            ],
        };
    },
};
</script>
```

### Properties

- `columns`: *(type: array, required)* An array containing all the column objects. Each column object can contain the following properties: (If no order or direction property is set, the column is not sortable)
    - `property`: *(type: string, required)* The corresponding value will be shown in the column of the given row property. 
    - `title`: *(type: string)* The title that will be shown in the header. 
    - `filterable`: *(type: boolean, default: false)* Filter on this column? 
    - `visible`: *(type: boolean, default: true)* Make the column visible 
    - `direction`: *(type: boolean or null)* The initial sort direction. If null, the column is not sorted. If true, the sorting is ascending. If false, the sorting is descending.
    - `order`: *(type: number)* Column order to sort the rows. 
    - 'collapseIcon': *(type: boolean)* Indicates if this column will contain the collapse icon.
- `rows`: *(type: array, default: [])* An array containing all the row objects. Each row object has his own key value pairs and extra meta data. Meta data is prefixed with an underscore:
    - `_children`: *(type: array)* An array with child row objects.
    - `_hasChildren`: *(type: boolean, default: false)* Indicates if this row has children. This property will automatically be set to true if the children attribute is set.
    - `_showChildren`: *(type: boolean)* Indicates if the children has to be shown on create. If this is true, and hasChildren is true, but no children attribute is found, an async call will be initiated to get the children.
    - `_classes`: *(type: Object)* fixed styling for the current row. The key is the fixed word 'row' to add a class to the tr tag or a column indication without any slashes (see classes property below) and the value is vue based class object.  
- `totalRows`: *(type: number, default: rows.length)* The total number of rows. If this is greater than the current rows length, async calls will be executed if the unknown rows are requested.
- `filter`: *(type: string)* A value to change the filter.
- `showFilter`: *(type: boolean, default: true)* Show the filter input field.
- `async`: *(type: function)* The function that is called when making an async request. It takes the following parameters:
    - `filter`: *(type: string)* The filter value.
    - `sortColumns`: *(type: array)* A list of all columns that are sortable. The last sorted column is the last column in this list. A column has the following interesting properties for sorting:
        - `direction`: *(type: boolean or null)* See columns => direction
    - `start`: *(type: number)* Contains the current zero based start index.
    - `end`: *(type: number)* Contains the current zero based end index.
- `asyncChildren`: *(type: function)* The function that is called when making a request to load the children. It takes the parent row as parameter:
    - `parent`: *(type: Object)* If the child rows are called. This value is an Object that contains all the info from the parent row.
- `classes`: *(type: Object)* An object that regulates the design of the table. The latter items can override the earlier ones:
    - The key is a selector for rows, columns, and cells. You have two type of selectors: fixed selectors and row/column selectors:
        - fixed selectors: use the preserver words `table` or `info` to style the whole table or to style the info row (shown while loading or no rows are found)
        - row/column selectors: These selectors are divided by a slash. So you can have a row selector or a column selector. 
        The header row has index 0. The first data row has index 1. Some examples:
            - 'all': select all rows/columns.
            - 'even': select all even rows/columns.
            - 'odd': select all odd rows/columns.
            - '3': select row/column with index 3,
            - '5_7': select row/column 5 and 6,
            - '0_-1': select all rows/columns except the last one.
            - '1_4,5_8': select rows/columns 1,2,3,5,6,7
    - The value is a vue based class object.
    - Examples: 
        - '0_-1/': {'test-row': true} => will add the test class for all rows except the last one for all columns. 
        - '/1_3,5': {'test-column': true} => will add the test-column class for column 1,2,5 on all rows.
        - 'even/1': {'cell': true} => will add the cell class for column 1 on all even rows. 
 
    
### Templates

#### Title

The title template is used to change the title section. It has no scope.

```vue
<template slot="title">
    <h2>
        My own title
    </h2>
</template>
```

#### Filter

The filter template is used to change the filter section. It has no scope.

Don't forget to pass the updated filter to the vue-ads-table-tree component via the filter property.


```vue
<template slot="filter">
    <h3>Filter:</h3>
    <input
        type="text"
        placeholder="Filter..."
        @input="debounceFilter($event)"
    >
</template>
```

#### Pagination

The pagination template is used to change the [vue-ads-pagination](https://www.npmjs.com/package/vue-ads-pagination) component. The scoped properties are:

- `total`: *(type: number)* The total number of rows.
- `loading`: *(type: boolean)* Is the table loading extra pages?
- `page`: *(type: number)* The current page.
- `pageChange`: *(type: Function)* Call this function if the pageChange event is emitted.

Don't update the page property of the vue-ads-table-tree component after a pageChange event is emitted from the vue-ads-pagination component, 
otherwise the pageChange method is called twice and will trigger race conditions. If you want to change the page externally only change the page
property of the vue-ads-pagination component.

```vue
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
```

#### Column templates

If you want to use custom content in a cell, you can use the column templates. Name the template to the column properties. 
The scope is an object with the following parameters:

- `row`: *(type: Row)* The current row.
- `index`: *(type: number)* The zero-based index of the row.

If you don't want that custom content in the whole column, you can add the value of the column as a suffix.
So in this example you could use: `slot="firstName_bart"`

```vue
<template slot="firstName" slot-scope="props">
    <a :href="`https://www.google.com/search?q=${props.row.firstName}+${props.row.lastName}`" target="_blank">{{props.row.firstName}}</a>
</template>
```

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
