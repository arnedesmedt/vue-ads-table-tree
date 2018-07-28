<template>
    <div
        class="w-full p-3"
    >
        <div
            class="mt-3 mb-6 flex text-grey-darker"
        >
            <h2
                class="block pl-3 leading-normal"
            >
                Title
            </h2>
            <div
                class="flex-grow justify-end text-right"
            >
                <h3 class="inline pr-2">Filterable:</h3>
                <input
                    class="appearance-none border rounded py-2 px-3 text-grey-darker "
                    type="text"
                    placeholder="Filterable..."
                    v-model="filter"
                >
            </div>
        </div>
        <table
            class="w-full vue-ads-table-tree"
            :class="borderModel.tableClasses()"
            style="border-collapse: collapse;"
        >
            <thead>
                <tr
                    :class="borderModel.rowClasses(false)"
                >
                    <header-cell
                        v-for="(column, columnKey) in visibleColumns"
                        :key="columnKey"
                        :column="column"
                        :sortColumn="sortColumnCollection.getSortColumn(column)"
                        :last="columnKey === visibleColumns.length - 1"
                        :border="borderModel"
                        @sort="sortColumnCollection.sort(column)"
                    />
                </tr>
            </thead>
            <tbody>
                <tr
                    v-if="visibleRows.length === 0"
                >
                    <td
                        class="text-center py-6 text-sm"
                        :colspan="visibleColumns.length"
                    >
                        <!--En bij async nog checken not loading -->
                        <!--<span v-if="this.resolver.loading">Loading...</span>-->
                        <span>No results found</span>
                    </td>
                </tr>
                <body-row
                    v-for="(row, rowKey) in visibleRows"
                    :key="rowKey"
                    :row="row"
                    :index="rowKey"
                    :last="rowKey === visibleRows.length - 1"
                    :columns="visibleColumns"
                    :background="backgroundModel"
                    :border="borderModel"
                    @toggleChildren="toggleChildren(row)"
                />
            </tbody>
        </table>
        <pagination
            :totalItems="filteredRowCollection.length"
            :itemsPerPage="2"
            @click="pageChange"
        >

        </pagination>
    </div>
</template>

<script>
import '../assets/css/styles.css';

import HeaderCell from './HeaderCell';
import BodyRow from './BodyRow';
import Pagination from 'vue-ads-pagination';

import Border from '../models/Border';
import Background from '../models/Background';
import RowCollection from '../collections/RowCollection';
import ColumnCollection from '../collections/ColumnCollection';
import SortColumnCollection from '../collections/SortColumnCollection';
import PaginatedRowCollection from '../collections/PaginatedRowCollection';
import FilteredRowCollection from '../collections/FilteredRowCollection';
import SortedRowCollection from '../collections/SortedRowCollection';

import RowConnection from '../connections/RowConnection';

export default {
    name: 'TableTree',

    components: {
        HeaderCell,
        BodyRow,
        Pagination,
    },

    props: {
        background: {
            type: Object,
            required: false,
        },

        border: {
            type: Object,
            required: false,
        },

        columns: {
            type: Array,
            required: true,
        },

        rows: {
            type: Array,
            required: false,
            default: () => [],
        },

        asyncCall: {
            type: Function,
            required: false,
        },

        initItemsPerPage: {
            type: Number,
            required: false,
        },

        initPage: {
            type: Number,
            required: false,
        },

        initFilter: {
            type: String,
            required: false,
        },
    },

    data () {
        let data = {};

        data.filter = this.initFilter || '';

        data.borderModel = new Border(this.border);
        data.backgroundModel = new Background(this.background);

        data.columnCollection = new ColumnCollection(this.columns);
        data.sortColumnCollection = new SortColumnCollection(data.columnCollection);
        data.rowCollection = new RowCollection(this.rows);
        data.filteredRowCollection = new FilteredRowCollection(
            data.rowCollection,
            data.columnCollection
        );
        data.sortedRowCollection = new SortedRowCollection(
            data.filteredRowCollection,
            data.sortColumnCollection
        )
        data.paginatedRowCollection = new PaginatedRowCollection(data.sortedRowCollection);
        data.asyncRowCollection = new RowCollection();

        if (this.asyncCall) {
            data.rowConnection = new RowConnection(this.asyncCall);
        }

        return data;
    },

    created () {
        this.paginatedRowCollection.range = {
            start: 0,
            end: 2,
        };

        this.filteredRowCollection.filter = this.filter;
    },

    watch: {
        filter (value) {
            this.filteredRowCollection.filter = value;
        },
    },

    computed: {
        visibleColumns () {
            return this.columnCollection.items;
        },

        visibleRows () {
            return this.paginatedRowCollection.flatten();
        },
        // async () {
        //     return (this.filterOrSort && !this.allItemsLoaded) || !this.pageItemsLoaded;
        // },
        //
        // filterOrSort () {
        //     return this.asyncRows instanceof Function && (
        //         this.filterModel.trimValue.length > 0 ||
        //         this.columnCollection.hasSortedColumns
        //     );
        // },
        //
        // pageItemsLoaded () {
        //     return this.asyncRows === null ||
        //         this.rowCollection.itemsLoaded(
        //             this.paginateModel.range,
        //             this.paginateModel.totalItems
        //         );
        // },
        //
        // allItemsLoaded () {
        //     return this.asyncRows === null ||
        //         this.rowCollection.allItemsLoaded(
        //             this.paginateModel.totalItems
        //         );
        // },
    },

    methods: {
        toggleChildren (row) {
            this.callChildRows(row);
            row.toggleChildren();
        },

        callChildRows (parentRow) {
            if (!parentRow.childrenLoaded() && !this.rowConnection) {
                throw new Error(
                    'Add an asyncCall function if there is one row with hasChildren = true ' +
                    'and without any children attribute or an empty children attribute.'
                );
            }

            this.rowConnection.callChildRows(parentRow);
        },

        pageChange (page, range) {
            this.paginatedRowCollection.range = range;
        },
    },
};
</script>
