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
                    v-model="currentFilter"
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
                        v-for="(column, columnKey) in columnCollection.items"
                        :key="columnKey"
                        :column="column"
                        :last="columnKey === columnCollection.length - 1"
                        :border="borderModel"
                        @sort="sortColumn(column)"
                    />
                </tr>
            </thead>
            <tbody>
                <tr
                    v-if="visibleRowCollection.length === 0"
                >
                    <td
                        class="text-center py-6 text-sm"
                        :colspan="columnCollection.length"
                    >
                        <span v-if="asyncCall && connection.loading">Loading...</span>
                        <span v-else>No results found</span>
                    </td>
                </tr>
                <body-row
                    v-for="(row, rowKey) in visibleRowCollection.items"
                    :key="rowKey"
                    :row="row"
                    :index="rowKey"
                    :last="rowKey === visibleRowCollection.length - 1"
                    :columns="columnCollection.items"
                    :background="backgroundModel"
                    :border="borderModel"
                    @toggleChildren="toggleChildren(row)"
                />
            </tbody>
        </table>
        <pagination
            :totalItems="currentTotalRows"
            :itemsPerPage="itemsPerPage"
            :page="currentPage"
            @pageChange="pageChange"
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

import TableConnection from '../connections/TableConnection';
import RowRepository from '../repositories/RowRepository';

import Filter from '../services/Filter';
import Sort from '../services/Sort';
import Paginate from '../services/Paginate';
import Cache from '../services/Cache';

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

        totalRows: {
            type: Number,
            required: false,
        },

        asyncCall: {
            type: Function,
            required: false,
        },

        useCache: {
            type: Boolean,
            required: false,
            default: true,
        },

        itemsPerPage: {
            type: Number,
            required: false,
            default: 10,
        },

        page: {
            type: Number,
            required: false,
            default: 0,
        },

        filter: {
            type: String,
            required: false,
        },
    },

    data () {
        let data = {
            currentPage: this.page,
            currentTotalRows: this.totalRows || this.rows.length,
            currentFilter: this.filter,
            borderModel: new Border(this.border),
            backgroundModel: new Background(this.background),
            columnCollection: new ColumnCollection(this.columns),
            rowCollection: new RowCollection(this.rows),
            asyncRowCollection: new RowCollection(),
            visibleRowCollection: new RowCollection(),
            connection: undefined,
            rowRepository: undefined,
            cache: undefined,
        };

        data.filterService = new Filter(data.columnCollection);
        data.sortService = new Sort(data.columnCollection);
        data.paginateService = new Paginate();

        return data;
    },

    created () {
        if (this.asyncCall) {
            this.initializeAsync();
        }
    },

    watch: {
        border (border) {
            this.borderModel = new Border(border);
        },

        background (background) {
            this.backgroundModel = new Background(background);
        },

        rows (rows) {
            this.rowCollection.items = rows;
        },

        columns (columns) {
            this.columnCollection.items = columns;
        },

        filter (filter) {
            this.currentFilter = filter;
        },

        page (page) {
            this.currentPage = page;
        },

        totalRows (totalRows) {
            this.currentTotalRows = totalRows;
        },

        asyncCall (asyncCall) {
            this.initializeAsync();
        },

        currentFilter (currentFilter) {
            this.filterService.filterValue = currentFilter;

            if (this.currentPage === 0) {
                this.renderRootRows();
            } else {
                this.currentPage = 0;
            }
        },

        currentTotalRows (currentTotalRows) {
            if (this.rowCollection.length < currentTotalRows) {
                this.rowCollection.extendToLength(currentTotalRows);
            }
        },
    },

    computed: {
        makeAsyncCall () {
            if (!(this.asyncCall instanceof Function)) {
                return false;
            }

            if (!this.useCache || this.currentTotalRows === 0) {
                return true;
            }

            if (this.rowCollection.allRowsLoaded(this.currentTotalRows)) {
                return false;
            }

            if (this.filterService.isFiltering()) {
                return true;
            }

            if (this.rowCollection.allRootRowsLoaded(this.currentTotalRows)) {
                return false;
            }

            if (this.sortService.hasSortedColumns()) {
                return true;
            }

            return !this.rowCollection.allRowsInRangeLoaded(this.paginateService.range);
        },
    },

    methods: {
        initializeAsync () {
            this.connection = new TableConnection(
                this.asyncCall,
                this.filterService,
                this.sortService,
                this.paginateService
            );
            this.rowRepository = new RowRepository(this.connection);

            if (this.useCache) {
                this.cache = new Cache(
                    this.rowCollection,
                    this.filterService,
                    this.sortService,
                    this.paginateService
                );
            }
        },

        renderRows () {
            let visibleCollection;

            if (this.makeAsyncCall) {
                visibleCollection = this.asyncRowCollection;
                if (this.cache) {
                    this.cache.store(this.asyncRowCollection);
                }
            } else {
                let filteredCollection = this.filterService.filter(this.rowCollection);
                this.currentTotalRows = filteredCollection.length;
                let sortedCollection = this.sortService.sort(filteredCollection);
                visibleCollection = this.paginateService.paginate(sortedCollection);
            }

            this.visibleRowCollection.items = visibleCollection.flatten();
        },

        async renderRootRows () {
            await this.callRootRows();
            this.renderRows();
        },

        async renderChildRows (row) {
            await this.callChildRows(row);
            this.renderRows();
        },

        async toggleChildren (row) {
            row.toggleChildren();
            await this.renderChildRows(row);
        },

        async sortColumn (column) {
            this.columnCollection.sort(column);
            await this.renderRootRows();
        },

        async callRootRows () {
            if (!this.makeAsyncCall) {
                return;
            }

            this.visibleRowCollection.clear();
            let result = await this.rowRepository.callRootRows();
            this.currentTotalRows = result.total;
            this.asyncRowCollection.items = result.rows.items;
        },

        async callChildRows (parentRow) {
            if (parentRow.childrenLoaded() || !parentRow.showChildren) {
                return;
            }

            if (!this.asyncCall) {
                throw new Error(
                    'Add an asyncCall function if there is one row with hasChildren = true ' +
                    'and without or with an empty children attribute.'
                );
            }

            parentRow.children = await this.rowRepository.callChildRows(parentRow);
        },

        async pageChange (page, range) {
            this.currentPage = page;
            this.paginateService.range = range;
            await this.renderRootRows();
        },
    },
};
</script>
