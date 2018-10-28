<template>
    <div
        class="vue-ads-table-tree-w-full vue-ads-table-tree-p-3"
    >
        <div
            class="vue-ads-table-tree-mt-3 vue-ads-table-tree-mb-6 vue-ads-table-tree-flex text-grey-darker"
        >
            <slot>
                <h2
                    class="vue-ads-table-tree-block vue-ads-table-tree-pl-3 vue-ads-table-tree-leading-normal"
                >
                    Title
                </h2>
            </slot>
            <div
                class="vue-ads-table-tree-flex-grow vue-ads-table-tree-justify-end vue-ads-table-tree-text-right"
            >
                <h3 class="vue-ads-table-tree-inline vue-ads-table-tree-pr-2">Filterable:</h3>
                <input
                    class="vue-ads-table-tree-appearance-none vue-ads-table-tree-border vue-ads-table-tree-rounded vue-ads-table-tree-py-2 vue-ads-table-tree-px-3 vue-ads-table-tree-text-grey-darker "
                    type="text"
                    placeholder="Filterable..."
                    v-model="currentFilter"
                >
            </div>
        </div>
        <table
            class="vue-ads-table-tree-w-full vue-ads-table-tree"
            :class="stylingModel.tableClasses()"
            style="border-collapse: collapse;"
        >
            <thead>
                <tr
                    class="vue-ads-table-tree-border-b"
                >
                    <header-cell
                        v-for="(column, columnKey) in columnCollection.items"
                        :key="columnKey"
                        :index="columnKey"
                        :column="column"
                        :last="columnKey === columnCollection.length - 1"
                        :styling="stylingModel"
                        @sort="sortColumn(column)"
                    />
                </tr>
            </thead>
            <tbody>
                <tr
                    v-if="visibleRowCollection.length === 0"
                >
                    <td
                        class="vue-ads-table-tree-text-center vue-ads-table-tree-py-6 vue-ads-table-tree-text-sm"
                        :colspan="columnCollection.length"
                    >
                        <span v-if="isLoading">Loading...</span>
                        <span v-else>No results found</span>
                    </td>
                </tr>
                <body-row
                    v-for="(row, rowKey) in visibleRowCollection.items"
                    :key="rowKey"
                    :row="row"
                    :paginatedIndex="rowKey"
                    :index="rowKey + paginateService.range.start"
                    :last="rowKey === visibleRowCollection.length - 1"
                    :columns="columnCollection.items"
                    :slots="slots"
                    :styling="stylingModel"
                    @toggleChildren="toggleChildren(row)"
                >

                </body-row>
            </tbody>
        </table>
        <pagination
            :totalItems="currentTotalRows"
            :itemsPerPage="itemsPerPage"
            :page="currentPage"
            @page-change="pageChange"
            :loading="isLoading"
            :detailClasses="paginationDetailClasses"
            :buttonClasses="paginationButtonClasses"
        >
            <template slot-scope="props">
                <slot name="vue-ads-pagination" :range="props.range">
                    {{ props.range.start }} - {{ props.range.end }} of {{ props.range.total }} items
                </slot>
            </template>
        </pagination>
    </div>
</template>

<script>
import '../assets/css/styles.css';

import debounce from '../services/debounce';

import HeaderCell from './HeaderCell';
import BodyRow from './BodyRow';
import Pagination from 'vue-ads-pagination';

import Styling from '../models/Styling';

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
        styling: {
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

        paginationDetailClasses: {
            type: Array,
            required: false,
            default: () => [],
        },

        paginationButtonClasses: {
            type: Object,
            required: false,
            default: () => {},
        },
    },

    data () {
        let data = {
            currentPage: this.page,
            currentTotalRows: 0,
            currentFilter: this.filter,
            stylingModel: new Styling(this.styling),
            columnCollection: new ColumnCollection(this.columns),
            rowCollection: new RowCollection(this.rows),
            asyncRowCollection: new RowCollection(),
            visibleRowCollection: new RowCollection(),
            connection: undefined,
            rowRepository: undefined,
            cache: undefined,
            slots: {},
            filterDebounce: debounce(() => { this.renderAfterFilter(); }, 500),
        };

        data.filterService = new Filter(data.columnCollection);
        data.sortService = new Sort(data.columnCollection);
        data.paginateService = new Paginate();

        return data;
    },

    created () {
        this.currentTotalRows = this.totalRows || this.rows.length;
        if (this.asyncCall) {
            this.initializeAsync();
        }
    },

    mounted () {
        this.slots = this.columnSlots(this.columnCollection);
    },

    watch: {
        styling (styling) {
            this.stylingModel = new Styling(styling);
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

            if (this.makeAsyncCall) {
                this.filterDebounce();

                return;
            }

            this.renderAfterFilter();
        },

        currentTotalRows (currentTotalRows) {
            if (this.rowCollection.length < currentTotalRows) {
                this.rowCollection.extendToLength(currentTotalRows);
            }

            if (this.rowCollection.length > currentTotalRows && !this.filterService.isFiltering()) {
                throw new Error('totalRows can\'t be smaller than the number of rows');
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

        isLoading () {
            return this.asyncCall && this.connection.loading;
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
                let sortedCollection = this.sortService.sort(filteredCollection);
                visibleCollection = this.paginateService.paginate(sortedCollection);

                if (this.filterService.isFiltering()) {
                    this.currentTotalRows = filteredCollection.length;
                }
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

        async renderAfterFilter () {
            if (this.currentPage === 0) {
                await this.renderRootRows();
            } else {
                this.currentPage = 0;
            }
        },

        columnSlots (columnCollection) {
            let properties = columnCollection.properties;
            let slots = {};

            for (let key in this.$scopedSlots) {
                if (properties.includes(key)) {
                    slots[key] = this.$scopedSlots[key];
                }
            }

            return slots;
        },
    },
};
</script>
