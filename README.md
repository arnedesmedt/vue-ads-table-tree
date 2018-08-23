# vue-ads-table-tree

Vue ads table tree is a vue js table component, with a tree functionality.

The default features of a table component like filtering, sorting and paginating are implemented.
On top of that, you can add a tree structure: Rows can have child rows, that can be hidden or expanded.
 
Another cool feature, is the choice to load your rows in advance or via an async call to the backend.
You can even load a small part of your data, for example the first page, and then load all the other pages
with async calls to the backend.

It uses the handy
[tailwind](https://tailwindcss.com/docs/what-is-tailwind/) css library for styling.

## Demo

![Demo](https://media.giphy.com/media/jyINAhKJhEGpZGmOL1/giphy.gif)

I've written a demo in [JSFiddle](https://jsfiddle.net/arnedesmedt/7my8L42q)

## Installation

You can install the package via npm or yarn.

#### NPM

```npm install vue-ads-table-tree --save```

#### YARN

```yarn add vue-ads-table-tree```

## Usage

You can add the vue-ads-table-tree component by using the following code in your project.
This is the most simple example.

```vue
<template>
    <div id="app">
        <vue-ads-table-tree
            :columns="columns"
            :rows="rows"
        >
            <template>
                <h2 class="block pl-3 leading-normal">
                    My own title
                </h2>
            </template>
            <template slot="vue-ads-pagination" slot-scope="props">
                Items {{ props.range.start}} tot {{ props.range.end }} van de {{ props.range.total }}
            </template>
            <template slot="firstName" slot-scope="props">
                <a :href="`https://www.google.com/search?q=${props.row.firstName}+${props.row.lastName}`" target="_blank">{{props.row.firstName}}</a>
            </template>
        </vue-ads-table-tree>
  </div>
</template>

<script>
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

- `styling`: *(type: object)* Contains styling classes from the tailwind library. [Here](https://tailwindcss.com/docs/background-color) you can find all available classes. Combinations are possible by separating them by a space.
    - `rowsEven`: *(type: string, default: 'bg-grey-lightest')* Classes to add on the even rows.
    - `rowsOdd`: *(type: string, default: 'bg-white')* Classes to add on the odd rows.
    - `rowsAll`: *(type: string, default: 'hover:bg-grey-lighter')* Classes to add on all rows.
    - `rowsAllExceptLast`: *(type: string, default: 'border-b')* Classes to add on all rows except on the last one.
    - `columnsEven`: *(type: string)* Classes to add on the even columns.
    - `columnsOdd`: *(type: string)* Classes to add on the odd columns.
    - `columnsAll`: *(type: string)*Classes to add on all columns.
    - `columnsAllExceptLast`: *(type: string, default: 'border-r')* Classes to add on all columns except on the last one.
    - `table`: *(type: string, default: 'border')* Classes to add on the whole table.
- `columns`: *(type: array, required)* An array containing all the column objects. Each column object can contain the following properties:
    - `property`: *(type: string, required)* The corresponding value will be shown in the column of the given row property. 
    - `title`: *(type: string)* The title that will be shown in the header. 
    - `filterable`: *(type: boolean)* Filter on this column? 
    - `sortable`: *(type: boolean)* Is this column sortable? 
    - `direction`: *(type: boolean or null)* The initial sort direction. If null, the column is not sorted. If true, the sorting is ascending. If false, the sorting is descending.
- `rows`: *(type: array, default: [])* An array containing all the row objects. Each row object has his own key value pairs and extra meta data:
    - `children`: *(type: array)* An array with child row objects.
    - `hasChildren`: *(type: boolean, default: false)* Indicates if this row has children. This property will automatically be set to true if the children attribute is set.
    - `showChildren`: *(type: boolean)* Indicates if the children has to be shown on create. If this is true, and hasChildren is true, but no children attribute is found, an async call will be initiated to get the children.  
- `totalRows`: *(type: number, default: rows.length)* The total number of rows. If this is greater than the current rows length, async calls will be executed if the unknown rows are requested.
- `asyncCall`: *(type: function)* The function that is called when making an async request. It takes the following parameters:
    - `range`: *(type: object)* The paginated range with a start and end index.
        - `start`: *(type: number)* Contains the current zero based start index.
        - `end`: *(type: number)* Contains the current zero based end index.
    - `filter`: *(type: string)* The filter value.
    - `sortColumns`: *(type: array)* A list of all columns that are sortable. The last sorted column is the last column in this list. A column has the following interesting properties for sorting:
        - `direction`: *(type: boolean or null)* See columns => direction
    - `parent`: *(type: Row)* If the child rows are called. This value is a Row object that contains all the info from the parent row.
- `useCache`: *(type: boolean)* Async called rows will be stored in the cache if no sorting or filtering is done and this value is true.
- `itemsPerPage`: *(type: number, default: 10)* The max amount of items on one page.
- `page`: *(type: number, default: 0)* A zero-based number to set the initial page.
- `filter`: *(type: string)* The initial filter value.
- `paginationDetailClasses`: *(type: array)* A list of (tailwind) classes you can add to change the pagination detail box ui.
- `paginationButtonClasses`: *(type: object)* An object to change the pagination buttons ui for each state:
    - `default`: *(type: array)* A list of (tailwind) classes you can add to change the ui of the default pagination button. These classes are added on all pagination buttons.
    - `active`: *(type: array)* A list of (tailwind) classes you can add to change the ui of the active pagination button.
    - `disabled`: *(type: array)* A list of (tailwind) classes you can add to change the ui of the disabled pagination button.
    - `dots`: *(type: array)* A list of (tailwind) classes you can add to change the ui of the pagination dots.
    
### Templates

#### Default

The default template is used to change the title section. It has no scope.

```vue
<template>
    <h2 class="block pl-3 leading-normal">
        My own title
    </h2>
</template>
```

#### Pagination

The pagination template used in the [vue-ads-pagination](https://www.npmjs.com/package/vue-ads-pagination) component, to customize the pagination details.

```vue
<template slot="vue-ads-pagination" scope="props">
    Items {{ props.range.start}} - {{ props.range.end }}. Total: {{ props.range.total }}
</template>
```

#### Column templates

If you want to use custom content in a cell, you can use the column templates. Name the template to the column properties. The scope is an object with the following parameters:

- `row`: *(type: Row)* The current row.
- `index`: *(type: number)* The zero-based index of the row.

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
