<template>
    <div
        class="vue-ads-w-full vue-ads-font-sans"
    >
        <!-- HEADER -->
        <div
            v-if="hasHeader"
            class="vue-ads-mt-3 vue-ads-mb-6 vue-ads-flex"
        >
            <!-- TITLE -->
            <div
                class="vue-ads-flex vue-ads-justify-center vue-ads-flex-col"
            >
                <slot name="title"/>
            </div>
            <!-- FILTER -->
            <div
                v-if="hasFilterColumns"
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
                        :value="filter"
                        @input="debounceFilter($event.target.value)"
                    >
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
                        v-for="(column, key) in columns"
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
                        :colspan="columns.length"
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
                        v-for="(row, rowKey) in flattenedRows"
                        :key="rowKey"
                        :row="row"
                        :row-index="rowKey"
                        :columns="columns"
                        :slots="slots"
                        :css-processor="cssProcessor"
                        @toggleChildren="toggleChildren(row)"
                    />
                </slot>
            </tbody>
        </table>
        <!-- PAGINATION -->
        <slot
            :total="totalRows"
            :page="page"
            :loading="loading"
            :pageChange="pageChange"
            :itemsPerPage="itemsPerPage"
            :rangeChange="rangeChange"
            name="pagination"
        >
            <vue-ads-pagination
                :total-items="totalRows"
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

        filter: {
            type: String,
            required: false,
            default: '',
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
                    '0/all': {
                        'vue-ads-px-4': true,
                        'vue-ads-py-2': true,
                        'vue-ads-text-left': true,
                    },
                    '0_-1/': {
                        'vue-ads-border-b': true,
                    },
                    // '/0_-1': {
                    //     'vue-ads-border-r': true,
                    // },
                };
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
            sequentialCalls: 0,
            asyncTotalRows: null,
        };
    },

    computed: {
        columnProperties () {
            return this.columns.map(column => column.property);
        },

        sortColumns () {
            return this.columns
                .filter(column => column.direction !== null)
                .filter(column => column.order)
                .sort((columnA, columnB) => columnA.order - columnB.order);
        },

        filterColumnNames () {
            return this.columns
                .filter(column => {
                    return column.filterable;
                })
                .map(column => column.property);
        },

        regexp () {
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
            return this.flatten(this.paginatedRows);
        },

        totalVisibleRows () {
            return this.flattenedRows.length;
        },

        totalRows () {
            return this.filteredRows.length;
            // return this.asyncTotalRows || this.filteredRows.length;
        },
        //
        // processed () {
        //     return Boolean(this.currentFilter || this.sortColumns.length);
        // },
        //
        // visibleRows () {
        //     return this.call ? this.asyncCollection.flatten() : this.paginatedRows.flatten();
        // },
        //
        // call () {
        //     let totalRows = this.currentTotalRows;
        //
        //     if (!(this.async instanceof Function)) {
        //         return false;
        //     }
        //
        //     if (!this.useCache || totalRows === 0) {
        //         return true;
        //     }
        //
        //     if (this.rowCollection.fullyFilled(this.rowCollection.length)) {
        //         return false;
        //     }
        //
        //     if (this.currentFilter) {
        //         return true;
        //     }
        //
        //     if (this.rowCollection.filled(this.rowCollection.length)) {
        //         return false;
        //     }
        //
        //     if (this.sortColumns.length) {
        //         return true;
        //     }
        //
        //     return !this.rowCollection.filled(this.end, this.start);
        // },

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
            return this.paginatedRows.length > 0;
        },

        hasHeader () {
            return this.hasFilterColumns || this.$slots.title;
        },

        hasFilterColumns () {
            return this.filterColumnNames.length > 0;
        },
    },

    watch: {
        rows: {
            handler: 'rowsChanged',
            immediate: true,
            deep: true,
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

        // totalRows: {
        //     handler: 'totalRowsChange',
        //     immediate: true,
        // },

        // currentFilter: {
        //     handler: 'currentFilterChange',
        // },
        //
        // page: {
        //     handler: 'pageChange',
        // },
        //
        // visibleRows (visibleRows) {
        //     this.classProcessor.totalRows = visibleRows.length === 0 ? 2 : visibleRows.length + 1;
        // },
    },

    async created () {
        // if (!(this.async instanceof Function)) {
        //     return;
        // }
        //
        // await this.callChildRowsOfCollection(this.rowCollection);
        // this.sequentialCalls = 0;
    },

    methods: {
        rowsChanged (rows, oldRows, parent = 0) {
            rows.forEach(row => {
                if (!row.hasOwnProperty('children')) {
                    Vue.set(row, 'children', []);
                }

                if (!row.hasOwnProperty('visibleChildren')) {
                    row.visibleChildren = row.children;
                }

                if (!row.hasOwnProperty('showChildren')) {
                    Vue.set(row, 'showChildren', false);
                }

                if (!row.hasOwnProperty('parent')) {
                    Vue.set(row, 'parent', parent);
                }

                if (row.children.length > 0) {
                    this.rowsChanged(row.children, null, parent + 1);
                }
            });

            this.showChildren = true;
            this.$nextTick(() => {
                this.showChildren = false;
            });
        },

        columnsChanged (columns) {
            let maxSortOrder = this.maxSortOrder();
            columns.forEach(column => {
                if (typeof column.property !== 'string') {
                    Vue.set(column, 'property', '');
                }

                if (!column.hasOwnProperty('order') && !column.hasOwnProperty('direction')) {
                    return;
                }

                if (!Number.isInteger(column.order) || column.order < 0) {
                    column.order = ++maxSortOrder;
                }

                if (!column.hasOwnProperty('direction')) {
                    Vue.set(column, 'direction', true);
                }
            });

            if (!this.hasCollapseIcon(columns)) {
                Vue.set(columns[0], 'collapseIcon', true);
            }

            this.cssProcessor.totalColumns = columns.length;
        },

        hasCollapseIcon (columns) {
            return columns.find(column => column.collapseIcon);
        },

        rowMatch (row) {
            if (this.filter === '' || this.filterColumnNames.length === 0) {
                row.visibleChildren = row.children.filter(this.rowMatch);
                return true;
            }

            let rowMatch = Object.keys(row)
                .filter(rowKey => this.filterColumnNames.includes(rowKey))
                .filter(filterKey => this.regexp.test(row[filterKey]))
                .length > 0;

            row.visibleChildren = row.children.filter(this.rowMatch);

            if (row.visibleChildren.length === 0) {
                return rowMatch;
            }

            // only show the children if a row is added or removed or if the filter changed
            if (this.showChildren) {
                row.showChildren = true;
            }

            return true;
        },

        maxSortOrder () {
            return this.columns.reduce((max, column) => {
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
                .filter(row => row.visibleChildren.length > 0)
                .forEach(row => {
                    row.visibleChildren = this.sortRows(row.visibleChildren);
                });

            return rows;
        },

        flatten (rows) {
            return rows
                .reduce((flattenedRows, row) => {
                    return flattenedRows.concat([
                        row,
                        ...(row.showChildren ? this.flatten(row.visibleChildren) : []),
                    ]);
                }, []);
        },

        // totalRowsChange (totalRows) {
        //     if (totalRows > this.rowCollection.length) {
        //         this.rowCollection.length = totalRows;
        //     }
        // },

        filterChange (filter) {
            this.page = 0;

            this.showChildren = true;
            this.$nextTick(() => {
                this.showChildren = false;
            });
        },

        // async currentFilterChange (currentFilter) {
        //     this.pageChange(0);
        //     await this.callRootRows();
        // },
        //
        async sort (column) {
            column.direction = !column.direction;
            column.order = this.maxSortOrder() + 1;
            // this.columnCollection.sort(column);
            // this.sortColumns = this.columnCollection.sortColumns();
            // await this.callRootRows();
        },

        async pageChange (page) {
            this.page = page;
        },

        async rangeChange (start, end) {
            // if (page === this.currentPage && this.start !== null && this.end !== null) {
            //     return;
            // }
            //
            // this.currentPage = page;
            //
            this.start = start;
            this.end = end;
            //
            // await this.callRootRows();
        },

        async toggleChildren (row) {
            // await this.callChildRows(row);
            row.showChildren = !row.showChildren;
        },
        //
        // async callChildRows (parent) {
        //     if (parent.showChildren || !(this.async instanceof Function) || (this.useCache && parent.childrenLoaded())) {
        //         return;
        //     }
        //
        //     parent.toggleLoading();
        //     let result = await this.callRows(parent);
        //     this.sequentialCalls = 0;
        //     parent[this.processed ? 'visibleChildren' : 'children'] = result.rows;
        //     parent.toggleLoading();
        // },
        //
        // async callRootRows () {
        //     if (!this.call) {
        //         return;
        //     }
        //
        //     this.loading = true;
        //
        //     let result = await this.callRows();
        //     this.sequentialCalls = 0;
        //
        //     if (!this.processed && this.useCache) {
        //         this.rowCollection.push(result.rows.items, this.start);
        //         this.asyncCollection.clear();
        //         this.asyncTotalRows = null;
        //     } else {
        //         this.asyncCollection = result.rows;
        //         this.asyncTotalRows = this.processed ? result.total : null;
        //     }
        //
        //     this.loading = false;
        // },
        //
        // async callRows (parent = null) {
        //     if (++this.sequentialCalls > this.maxSequetialCalls) {
        //         return false;
        //     }
        //
        //     let result = await this.async(this.currentFilter, this.sortColumns, this.start, this.end, parent);
        //     result.rows = new RowCollection(result.rows);
        //
        //     await this.callChildRowsOfCollection(result.rows);
        //
        //     return result;
        // },
        //
        // async callChildRowsOfCollection (rows) {
        //     let rowsToLoad = rows.items
        //         .filter(row => row.loadChildren());
        //
        //     for (let i = 0; i < rowsToLoad.length; i++) {
        //         let row = rowsToLoad[i];
        //         row.toggleLoading();
        //         let result = await this.callRows(row);
        //         row.toggleLoading();
        //
        //         if (result) {
        //             row[this.processed ? 'visibleChildren' : 'children'] = result.rows;
        //         } else {
        //             row.toggleChildren();
        //         }
        //     }
        // },
    },
};
</script>
