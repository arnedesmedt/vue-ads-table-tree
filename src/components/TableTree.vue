<template>
    <div
        class="vue-ads-w-full vue-ads-font-sans"
    >
        <!-- HEADER -->
        <div
            v-if="displayHeader"
            class="vue-ads-mt-3 vue-ads-mb-6 vue-ads-flex"
        >
            <!-- TITLE -->
            <div
                class="vue-ads-flex-grow vue-ads-flex vue-ads-justify-center vue-ads-flex-col"
            >
                <slot name="title"/>
            </div>
            <!-- FILTER -->
            <div
                v-if="displayFilter"
                class="vue-ads-justify-end vue-ads-text-right"
            >
                <slot
                    name="filter"
                >
                    <vue-ads-text placeholder="Filterable..." :value="filter" @input="debounceFilter($event)">
                    </vue-ads-text>
                </slot>
            </div>
        </div>
        <!-- TABLE -->
        <table
            :class="tableClasses"
            style="border-collapse: collapse;"
        >
            <!-- TABLE HEADER -->
            <thead>
                <tr
                    :class="headerRowClasses"
                >
                    <vue-ads-header-cell
                        v-for="(column, key) in visibleColumns"
                        :key="key"
                        :column-index="key"
                        :direction="column.direction"
                        :sortable="[null, true, false].includes(column.direction)"
                        :css-processor="cssProcessor"
                        v-bind="column"
                        @sort="sort(column)"
                    />
                </tr>
            </thead>
            <!-- TABLE ROWS -->
            <tbody>
                <tr
                    v-if="hasNoResults"
                >
                    <td
                        :class="infoClasses"
                        :colspan="visibleColumns.length"
                    >
                        <span v-if="loading">
                            <slot name="loading">Loading...</slot>
                        </span>
                        <span v-else>
                            <slot name="no-rows">No results found</slot>
                        </span>
                    </td>
                </tr>
                <slot
                    v-else
                    name="rows"
                >
                    <vue-ads-row
                        v-for="(row, rowKey) in flattenedRows"
                        :key="rowKey"
                        :row="row"
                        :row-index="rowKey"
                        :columns="visibleColumns"
                        :slots="slots"
                        :css-processor="cssProcessor"
                        @toggleChildren="toggleChildren(row)"
                    />
                </slot>
            </tbody>
        </table>
        <!-- PAGINATION -->
        <slot
            :total="total"
            :page="page"
            :loading="loading"
            :pageChange="pageChange"
            :itemsPerPage="itemsPerPage"
            :rangeChange="rangeChange"
            name="pagination"
        >
            <vue-ads-pagination
                :total-items="total"
                :page="page"
                :loading="loading"
                :items-per-page="itemsPerPage"
                @page-change="pageChange"
                @range-change="rangeChange"
            />
        </slot>
    </div>
</template>

<script>
import Vue from 'vue';
import debounce from '../services/debounce';
import CSSProcessor from '../services/CSSProcessor';

import VueAdsHeaderCell from './HeaderCell';
import VueAdsRow from './Row.vue';

import VueAdsPagination from 'vue-ads-pagination';
import {
    VueAdsFormGroup,
    VueAdsSelect,
    VueAdsText,
} from 'vue-ads-form-builder';


export default {
    name: 'VueAdsTableTree',

    components: {
        VueAdsHeaderCell,
        VueAdsRow,
        VueAdsPagination,
        VueAdsFormGroup,
        VueAdsSelect,
        VueAdsText,
    },

    props: {
        columns: {
            type: Array,
            required: true,
        },

        rows: {
            type: Array,
            default: () => [],
        },

        filter: {
            type: String,
            default: '',
        },

        showFilter: {
            type: Boolean,
            default: true,
        },

        classes: {
            type: Object,
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
                        'vue-ads-border-t': true,
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
                    '0/all': {
                        'vue-ads-px-4': true,
                        'vue-ads-py-2': true,
                        'vue-ads-text-left': true,
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

        asyncChildren: {
            type: Function,
            default: null,
        },

        async: {
            type: Function,
            default: null,
        },

        totalRows: {
            type: Number,
        },
    },

    mounted () {
        this.callRootRows();
    },

    data () {
        return {
            debounceFilter: debounce(filter => this.$emit('filter-change', filter), 500),
            cssProcessor: new CSSProcessor(this.columns.length, this.classes),
            page: 0,
            showChildren: false,
            itemsPerPage: 20,
            start: null,
            end: null,
            loading: false,
            asyncRows: [],
        };
    },

    computed: {
        visibleColumns () {
            return this.columns.filter(column => column.visible);
        },

        columnProperties () {
            return this.visibleColumns.map(column => column.property);
        },

        processed () {
            return this.filter || this.sortColumns.length > 0;
        },

        sortColumns () {
            return this.visibleColumns
                .filter(column => column.direction !== null)
                .filter(column => column.order)
                .sort((columnA, columnB) => columnA.order - columnB.order);
        },

        filterColumnProperties () {
            return this.visibleColumns
                .filter(column => {
                    return column.filterable;
                })
                .map(column => column.property);
        },

        filterRegex () {
            return new RegExp(this.filter, 'i');
        },

        filteredRows () {
            return this.rows
                .filter(this.rowMatch);
        },

        sortedRows () {
            if (this.sortColumns.length === 0) {
                return this.filteredRows;
            }

            return this.sortRows(this.filteredRows);
        },

        paginatedRows () {
            return this.sortedRows.slice(this.start, this.end);
        },

        flattenedRows () {
            return this.flatten(this.call ? this.asyncRows : this.paginatedRows);
        },

        totalVisibleRows () {
            return this.flattenedRows.length;
        },

        total () {
            return !this.filter || this.call ? (this.totalRows || this.rows.length) : this.filteredRows.length;
        },

        call () {
            if (!(this.async instanceof Function)) {
                return false;
            }

            if (this.rows.length === 0) {
                return true;
            }

            if (this.fullLoaded && this.rows.find(this.findChildrenToCall)) {
                return false;
            }

            if (this.filter) {
                return true;
            }

            if (this.fullLoaded) {
                return false;
            }

            if (this.sortColumns.length) {
                return true;
            }

            return (this.rows.slice(this.start, this.end).length < (this.end - this.start));
        },

        fullLoaded () {
            return this.rows.length === (this.totalRows || this.rows.length);
        },

        slots () {
            let regex = new RegExp('^(' + this.columnProperties.join('|') + ')_', 'i');
            let slots = {};

            Object.keys(this.$scopedSlots)
                .forEach(slotKey => {
                    if (this.columnProperties.includes(slotKey) || regex.test(slotKey)) {
                        slots[slotKey] = this.$scopedSlots[slotKey];
                    }
                });

            return slots;
        },

        tableClasses () {
            return this.classes.table || {};
        },

        headerRowClasses () {
            return this.cssProcessor.process(0);
        },

        infoClasses () {
            return this.classes.info || {};
        },

        hasNoResults () {
            return !this.hasVisibleRows || this.loading;
        },

        hasVisibleRows () {
            return this.totalVisibleRows > 0;
        },

        displayHeader () {
            return this.displayFilter || this.$slots.title;
        },

        displayFilter () {
            return this.showFilter && this.filterColumnProperties.length > 0;
        },
    },

    watch: {
        rows: {
            handler: 'rowsChanged',
            immediate: true,
        },

        columns: {
            handler: 'columnsChanged',
            immediate: true,
        },

        filter: {
            handler: 'filterChange',
        },

        classes: function (classes)  {
            this.cssProcessor.classes = classes;
        },

        totalVisibleRows: function (totalVisibleRows) {
            this.cssProcessor.totalRows = totalVisibleRows === 0 ? 2 : totalVisibleRows + 1;
        },
    },

    methods: {
        rowsChanged (rows, oldRows, parent = 0) {
            rows
                .forEach(row => {
                    if (!row.hasOwnProperty('_children')) {
                        Vue.set(row, '_children', []);
                    }

                    if (!row.hasOwnProperty('_showChildren')) {
                        Vue.set(row, '_showChildren', false);
                    }

                    if (!row.hasOwnProperty('_meta')) {
                        Vue.set(row, '_meta', {
                            parent,
                            loading: false,
                            visibleChildren: row._children,
                        });
                    }

                    this.callChildRows(row);
                });

            rows
                .filter(row => row._children.length > 0)
                .forEach(row => this.rowsChanged(row._children, null, parent + 1));

            if (parent === 0) {
                this.showChildren = true;
                this.$nextTick(() => {
                    this.showChildren = false;
                });
            }
        },

        columnsChanged (columns) {
            let maxSortOrder = this.maxSortOrder();
            columns.forEach(column => {
                if (typeof column.property !== 'string') {
                    Vue.set(column, 'property', '');
                }

                if (!column.hasOwnProperty('visible')) {
                    Vue.set(column, 'visible', true);
                }

                if (!column.hasOwnProperty('order') && !column.hasOwnProperty('direction')) {
                    return;
                }

                if (!Number.isInteger(column.order) || column.order < 0) {
                    column.order = ++maxSortOrder;
                }

                if (!column.hasOwnProperty('direction')) {
                    Vue.set(column, 'direction', null);
                }
            });

            if (!this.hasCollapseIcon(columns)) {
                Vue.set(columns[0], 'collapseIcon', true);
            }

            this.cssProcessor.totalColumns = this.visibleColumns.length;
        },

        hasCollapseIcon (columns) {
            return columns.find(column => column.collapseIcon);
        },

        rowMatch (row) {
            if (this.filter === '' || this.filterColumnProperties.length === 0) {
                // filter is needed because of recursivity
                row._meta.visibleChildren = row._children.filter(this.rowMatch);
                return true;
            }

            let rowMatch = Object.keys(row)
                .filter(rowKey => this.filterColumnProperties.includes(rowKey))
                .filter(filterKey => this.filterRegex.test(row[filterKey]))
                .length > 0;

            row._meta.visibleChildren = row._children.filter(this.rowMatch);

            if (row._meta.visibleChildren.length === 0) {
                return rowMatch;
            }

            // only show the children if a row is added or removed or if the filter changed
            if (this.showChildren) {
                row._showChildren = true;
            }

            return true;
        },

        maxSortOrder () {
            return this.visibleColumns.reduce((max, column) => {
                return max < column.order ? column.order : max;
            }, 0);
        },

        sortRows (rows) {
            this.sortColumns
                .forEach(column => {
                    let direction = column.direction ? 1 : -1;
                    rows.sort((rowA, rowB) => {
                        let sortValueA = rowA[column.property];
                        let sortValueB = rowB[column.property];

                        if (typeof sortValueA === 'string' && typeof  sortValueB === 'string') {
                            return direction * ('' + sortValueA.localeCompare(sortValueB));
                        }

                        if (sortValueA < sortValueB) {
                            return -direction;
                        }

                        if (sortValueA > sortValueB) {
                            return direction;
                        }

                        return 0;
                    });
                });

            rows
                .filter(row => row._meta.visibleChildren.length > 0)
                .forEach(row => {
                    row._meta.visibleChildren = this.sortRows(row._meta.visibleChildren);
                });

            return rows;
        },

        flatten (rows) {
            return rows
                .reduce((flattenedRows, row) => {
                    return flattenedRows.concat([
                        row,
                        ...(row && row._showChildren ? this.flatten(row._meta.visibleChildren) : []),
                    ]);
                }, []);
        },

        findChildrenToCall (row) {
            return (row.hasOwnProperty('_hasChildren') && row._hasChildren) || row._children.find(this.findChildrenToCall);
        },

        async filterChange (filter) {
            this.page = 0;
            await this.callRootRows();

            this.showChildren = true;
            this.$nextTick(() => {
                this.showChildren = false;
            });
        },

        async sort (column) {
            column.direction = !column.direction;
            column.order = this.maxSortOrder() + 1;
            await this.callRootRows();
        },

        pageChange (page) {
            this.page = page;
        },

        async rangeChange (start, end) {
            this.start = start;
            this.end = end;
            await this.callRootRows();
        },

        async toggleChildren (row) {
            row._showChildren = !row._showChildren;
            await this.callChildRows(row);
        },

        async callRootRows () {
            if (!this.call) {
                return;
            }

            this.loading = true;

            let rows = await this.async(this.filter, this.sortColumns, this.start, this.end);
            this.rowsChanged(rows);

            if (!this.processed) {
                rows.forEach((row, index) => {
                    Vue.set(this.rows, this.start + index, row);
                });
                this.asyncRows = [];
            } else {
                this.asyncRows = rows;
            }

            this.loading = false;
        },

        async callChildRows (parent) {
            if (
                !parent._showChildren ||
                !parent._hasChildren ||
                !(this.asyncChildren instanceof Function) ||
                parent._children.length > 0
            ) {
                return;
            }

            parent._meta.loading = true;
            this.storeChildren(await this.asyncChildren(parent), parent);
            Vue.delete(parent, '_hasChildren');
            parent._meta.loading = false;
        },

        storeChildren (children, parent) {
            this.rowsChanged(children, null, parent._meta.parent + 1);
            parent._children = children;
            parent._meta.visibleChildren = children;
        },
    },
};
</script>
