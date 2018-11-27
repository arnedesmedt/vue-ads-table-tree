<template>
    <div
        class="vue-ads-w-full vue-ads-p-3"
    >
        <div
            class="vue-ads-mt-3 vue-ads-mb-6 vue-ads-flex"
        >
            <div
                class="vue-ads-flex vue-ads-justify-center vue-ads-flex-col"
            >
                <slot
                    name="title"
                >
                    <h2
                        class="vue-ads-block vue-ads-pl-3 justify-center"
                    >
                        Title
                    </h2>
                </slot>
            </div>
            <div
                v-if="columnCollection.hasFilterColumns()"
                class="vue-ads-flex-grow vue-ads-justify-end vue-ads-text-right"
            >
                <slot
                    name="filter"
                >
                    <h3 class="vue-ads-inline vue-ads-pr-2">Filterable:</h3>
                    <input
                        class="vue-ads-appearance-none vue-ads-border vue-ads-rounded vue-ads-py-2 vue-ads-px-3"
                        type="text"
                        placeholder="Filterable..."
                        @input="debounceFilter($event)"
                    >
                </slot>
            </div>
        </div>
        <table
            :class="tableClasses"
            style="border-collapse: collapse;"
        >
            <thead>
                <tr
                    :class="headerRowClasses"
                >
                    <vue-ads-header-cell
                        v-for="(column, key) in columnCollection.items"
                        :key="key"
                        :direction="column.direction"
                        :sortable="column.sortable"
                        :classes="classProcessor"
                        v-bind="column"
                        @sort="sort(column)"
                    />
                </tr>
            </thead>
            <tbody>
                <tr
                    v-if="visibleRows.length === 0 || loading"
                >
                    <td
                        :class="infoClasses"
                        :colspan="columnCollection.length"
                    >
                        <span v-if="loading">Loading...</span>
                        <span v-else>No results found</span>
                    </td>
                </tr>
                <slot
                    v-else
                    name="rows"
                >
                    <vue-ads-row
                        v-for="(row, rowKey) in visibleRows"
                        :key="rowKey"
                        :row="row"
                        :columns="columnCollection"
                        :slots="slots"
                        :classes="classProcessor"
                        @toggleChildren="toggleChildren(row)"
                    />
                </slot>
            </tbody>
        </table>
        <slot
            :total="currentTotalRows"
            :page="currentPage"
            :loading="loading"
            :pageChange="pageChange"
            name="pagination"
        >
            <vue-ads-pagination
                :total-items="currentTotalRows"
                :page="currentPage"
                :loading="loading"
                :items-per-page="10"
                @page-change="pageChange"
            />
        </slot>
    </div>
</template>

<script>
import '../assets/css/tailwind.css';

import debounce from '../services/debounce';
import ClassProcessor from '../services/ClassProcessor';

import VueAdsHeaderCell from './HeaderCell';
import VueAdsRow from './Row.vue';
import VueAdsPagination from 'vue-ads-pagination';

import RowCollection from '../collections/RowCollection';
import ColumnCollection from '../collections/ColumnCollection';

export default {
    name: 'VueAdsTableTree',

    components: {
        VueAdsHeaderCell,
        VueAdsRow,
        VueAdsPagination,
    },

    props: {
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
            default: 0,
            validator: (totalRows) => {
                return totalRows >= 0;
            },
        },

        filter: {
            type: String,
            required: false,
            default: '',
        },

        page: {
            type: Number,
            required: false,
            default: 0,
            validator: (page) => {
                return page >= 0;
            },
        },

        async: {
            type: Function,
            required: false,
            default: null,
        },

        useCache: {
            type: Boolean,
            required: false,
            default: true,
        },

        maxSequetialCalls: {
            type: Number,
            required: false,
            default: 5,
            validator: (maxSequentialCalls) => {
                return maxSequentialCalls > 1;
            },
        },

        classes: {
            type: Object,
            required: false,
            default: () => {
                return {
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
                };
            },
        },
    },

    data () {
        return {
            columnCollection: new ColumnCollection(this.columns),
            rowCollection: new RowCollection(this.rows),
            classProcessor: new ClassProcessor(this.classes, this.columns.length),
            currentFilter: null,
            debounceFilter: debounce(e => this.filterChange(e.target.value), 500),
            sortColumns: [],
            currentPage: this.page,
            start: null,
            end: null,
            loading: false,
            sequentialCalls: 0,
            asyncCollection: new RowCollection(),
            asyncTotalRows: null,
        };
    },

    computed: {
        currentTotalRows () {
            if (this.loading) {
                return 0;
            }

            return this.asyncTotalRows || this.filteredRows.length;
        },

        processed () {
            return Boolean(this.currentFilter || this.sortColumns.length);
        },

        filteredRows () {
            return this.rowCollection
                .filter(new RegExp(this.currentFilter, 'i'), this.columnCollection.filterColumnNames);
        },

        sortedRows () {
            let filteredRows = this.filteredRows;

            return filteredRows.sort(this.sortColumns);
        },

        paginatedRows () {
            return this.sortedRows
                .paginate(this.start, this.end);
        },

        visibleRows () {
            return this.call ? this.asyncCollection.flatten() : this.paginatedRows.flatten();
        },

        call () {
            let totalRows = this.currentTotalRows;

            if (!(this.async instanceof Function)) {
                return false;
            }

            if (!this.useCache || totalRows === 0) {
                return true;
            }

            if (this.rowCollection.fullyFilled(this.rowCollection.length)) {
                return false;
            }

            if (this.currentFilter) {

                return true;
            }
            if (this.rowCollection.filled(this.rowCollection.length)) {

                return false;
            }
            if (this.sortColumns.length) {

                return true;
            }

            return !this.rowCollection.filled(this.end, this.start);
        },

        slots () {
            let properties = this.columnCollection.properties;
            let regex = new RegExp('^(' + properties.join('|') + ')_', 'i');
            let slots = {};

            for (let key in this.$scopedSlots) {
                if (properties.includes(key) || regex.test(key)) {
                    slots[key] = this.$scopedSlots[key];
                }
            }

            return slots;
        },

        tableClasses () {
            return this.classes.table || {};
        },

        headerRowClasses () {
            return this.classProcessor.process(0);
        },

        infoClasses () {
            return this.classes.info || {};
        },
    },

    watch: {
        totalRows: {
            handler: 'totalRowsChange',
            immediate: true,
        },

        filter: {
            handler: 'filterChange',
            immediate: true,
        },

        currentFilter: {
            handler: 'currentFilterChange',
        },

        page: {
            handler: 'pageChange',
        },

        visibleRows (visibleRows) {
            this.classProcessor.totalRows = visibleRows.length === 0 ? 2 : visibleRows.length + 1;
        },
    },

    async created () {
        if (!(this.async instanceof Function)) {
            return;
        }

        await this.callChildRowsOfCollection(this.rowCollection);
        this.sequentialCalls = 0;
    },

    methods: {
        totalRowsChange (totalRows) {
            if (totalRows > this.rowCollection.length) {
                this.rowCollection.length = totalRows;
            }
        },

        filterChange (filter) {
            if (filter === this.currentFilter) {
                return;
            }

            this.currentFilter = filter;
        },

        async currentFilterChange (currentFilter) {
            this.pageChange(0);
            await this.callRootRows();
        },

        async sort (column) {
            this.columnCollection.sort(column);
            this.sortColumns = this.columnCollection.sortColumns();
            await this.callRootRows();
        },

        async pageChange (page, start = null, end = null) {
            if (page === this.currentPage && this.start !== null && this.end !== null) {
                return;
            }

            this.currentPage = page;

            if (start !== null) {
                this.start = start;
            }

            if (end !== null) {
                this.end = end;
            }

            await this.callRootRows();
        },

        async toggleChildren (row) {
            await this.callChildRows(row);
            row.toggleChildren();
        },

        async callChildRows (parent) {
            if (parent.showChildren || !(this.async instanceof Function) || (this.useCache && parent.childrenLoaded())) {
                return;
            }

            parent.toggleLoading();
            let result = await this.callRows(parent);
            this.sequentialCalls = 0;
            parent[this.processed ? 'visibleChildren' : 'children'] = result.rows;
            parent.toggleLoading();
        },

        async callRootRows () {
            if (!this.call) {
                return;
            }

            this.loading = true;

            let result = await this.callRows();
            this.sequentialCalls = 0;

            if (!this.processed && this.useCache) {
                this.rowCollection.push(result.rows.items, this.start);
                this.asyncCollection.clear();
                this.asyncTotalRows = null;
            } else {
                this.asyncCollection = result.rows;
                this.asyncTotalRows = this.processed ? result.total : null;
            }

            this.loading = false;
        },

        async callRows (parent = null) {
            if (++this.sequentialCalls > this.maxSequetialCalls) {
                return false;
            }

            let result = await this.async(this.currentFilter, this.sortColumns, this.start, this.end, parent);
            result.rows = new RowCollection(result.rows);

            await this.callChildRowsOfCollection(result.rows);

            return result;
        },

        async callChildRowsOfCollection (rows) {
            let rowsToLoad = rows.items
                .filter(row => row.loadChildren());

            for (let i = 0; i < rowsToLoad.length; i++) {
                let row = rowsToLoad[i];
                row.toggleLoading();
                let result = await this.callRows(row);
                row.toggleLoading();

                if (result) {
                    row[this.processed ? 'visibleChildren' : 'children'] = result.rows;
                } else {
                    row.toggleChildren();
                }
            }
        },
    },
};
</script>
