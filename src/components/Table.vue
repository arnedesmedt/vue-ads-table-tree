<template>
    <table
        :class="tableClasses"
        class="vue-ads-w-full vue-ads-font-sans"
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
                    :sort-icon-slot="sortIconSlot"
                    v-bind="column"
                    @sort="sort(column)"
                />
            </tr>
        </thead>
        <!-- TABLE ROWS -->
        <tbody>
            <tr
                v-if="infoVisible"
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
            <template
                v-else
            >
                <vue-ads-row
                    v-for="(row, rowKey) in flattenedRows"
                    :key="rowKey"
                    :row="row"
                    :row-index="rowKey"
                    :columns="visibleColumns"
                    :slots="rowSlots"
                    :toggle-children-icon-slot="toggleChildrenIconSlot"
                    :css-processor="cssProcessor"
                    @toggleChildren="toggleChildren(row)"
                />
            </template>
        </tbody>
    </table>
</template>

<script>
import Vue from 'vue';
import CSSProcessor from '../services/CSSProcessor';

import rows from '../mixins/rows';
import columns from '../mixins/columns';
import filter from '../mixins/filter';
import slots from '../mixins/slots';
import pagination from '../mixins/pagination';
import styling from '../mixins/styling';

import VueAdsHeaderCell from './HeaderCell';
import VueAdsRow from './Row.vue';

export default {
    name: 'VueAdsTable',

    components: {
        VueAdsHeaderCell,
        VueAdsRow,
    },

    mixins: [
        rows,
        columns,
        filter,
        slots,
        pagination,
        styling,
    ],

    props: {
        temp: {
            type: Boolean,
            default: false,
        },

        loading: {
            type: Boolean,
            default: false,
        },

        excel: {
            type: Boolean,
            default: false,
        },
    },

    data () {
        return {
            cssProcessor: new CSSProcessor(this.columns.length, this.classes),
        };
    },

    computed: {
        filterRegex () {
            return new RegExp(this.filter, 'i');
        },

        filteredRows () {
            if (this.temp) {
                return this.rows;
            }

            // Always execute because of the children filtering.
            let filteredRows = Array.from(this.rows).filter(this.rowMatch);

            if (this.isFiltering) {
                return filteredRows;
            }

            return this.rows;
        },

        sortedRows () {
            if (this.sortColumns.length === 0 || this.temp) {
                return this.filteredRows;
            }

            return this.rowsSorted(this.filteredRows);
        },

        paginatedRows () {
            if (this.temp) {
                return this.sortedRows;
            }

            return this.sortedRows.slice(this.start, this.end);
        },

        flattenedRows () {
            return this.flatten(this.paginatedRows);
        },

        totalVisibleRows () {
            return this.flattenedRows.length;
        },

        sortIconSlot () {
            return this.currentSlots['sort-icon'] || null;
        },

        toggleChildrenIconSlot () {
            return this.currentSlots['toggle-children-icon'] || null;
        },

        rowSlots () {
            let regexCell = new RegExp('^(' + this.columnProperties.join('|') + ')_', 'i');
            let regexRow = new RegExp('^_.+$', 'i');
            let slots = {};

            Object.keys(this.currentSlots)
                .forEach(slotKey => {
                    if (this.columnProperties.includes(slotKey) || regexCell.test(slotKey) || regexRow.test(slotKey)) {
                        slots[slotKey] = this.currentSlots[slotKey];
                    }
                });

            return slots;
        },

        infoVisible () {
            return this.totalVisibleRows === 0 || this.loading;
        },

        /////////////
        // CLASSES //
        /////////////

        tableClasses () {
            return this.classes.table || {};
        },

        headerRowClasses () {
            return this.cssProcessor.process(0);
        },

        infoClasses () {
            return this.classes.info || {};
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

        classes: {
            handler: 'classesChanged',
        },

        totalVisibleRows: {
            handler: 'totalVisibleRowsChanged',
            immediate: true,
        },

        filter: {
            handler: 'filterChanged',
            immediate: true,
        },

        excel: {
            handler: 'excelChanged',
            immediate: true,
        },
    },

    methods: {

        //////////////
        // WATCHERS //
        //////////////

        rowsChanged (rows, oldRows, parent) {
            this.initRows(rows, parent);
        },

        columnsChanged (columns) {
            let maxSortOrder = this.maxSortOrder();
            columns.forEach(column => {
                this.initColumn(column, maxSortOrder);
                if (column.order === maxSortOrder) {
                    maxSortOrder++;
                }
            });

            if (!columns.find(column => column.collapseIcon)) {
                Vue.set(columns[0], 'collapseIcon', true);
            }

            this.cssProcessor.totalColumns = this.visibleColumns.length;
        },

        classesChanged (classes)  {
            this.cssProcessor.classes = classes;
        },

        totalVisibleRowsChanged (totalVisibleRows) {
            this.cssProcessor.totalRows = totalVisibleRows === 0 ? 2 : totalVisibleRows + 1;
        },

        filterChanged (filter) {
            this.$emit('total-filtered-rows-change', this.filteredRows.length);
        },

        /////////////
        // METHODS //
        /////////////
        initColumn (column, order) {
            if (typeof column.property !== 'string') {
                Vue.set(column, 'property', '');
            }

            if (!column.hasOwnProperty('visible')) {
                Vue.set(column, 'visible', true);
            }

            if (!column.hasOwnProperty('excel')) {
                Vue.set(column, 'excel', true);
            }

            if (!column.hasOwnProperty('order') && !column.hasOwnProperty('direction')) {
                return;
            }

            if (!Number.isInteger(column.order) || column.order < 0) {
                column.order = order;
            }

            if (!column.hasOwnProperty('direction')) {
                Vue.set(column, 'direction', null);
            }
        },

        rowMatch (row) {
            if (row === undefined) {
                return true;
            }

            row._meta.visibleChildren = row._children.filter(this.rowMatch);

            if (!this.isFiltering) {
                return true;
            }

            if (row._meta.visibleChildren.length > 0) {
                row._showChildren = true;

                return true;
            }

            return Object.keys(row)
                .filter(rowKey => this.filterColumnProperties.includes(rowKey))
                .filter(filterKey => this.filterRegex.test(row[filterKey]))
                .length > 0;
        },

        maxSortOrder () {
            return this.visibleColumns.reduce((max, column) => {
                return max < column.order ? column.order : max;
            }, 0);
        },

        rowsSorted (rows) {
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
                    row._meta.visibleChildren = this.rowsSorted(row._meta.visibleChildren);
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

        sort (column) {
            column.direction = !column.direction;
            column.order = this.maxSortOrder() + 1;
            this.$emit('sort', this.sortColumns);
        },

        toggleChildren (row) {
            row._showChildren = !row._showChildren;
            this.$emit('toggle-children', row);
        },

        excelChanged () {
            if (!this.excel) {
                return;
            }

            this.$emit(
                'excel',
                {
                    fields: Object.assign({
                        '#': '_order',
                    }, this.excelFields()),
                    data: this.excelData(this.sortedRows),
                }
            );
        },

        excelFields () {
            return this.columns
                .filter(column => column.excel)
                .reduce((result, column) => {
                    result[column.title] = column.property;

                    return result;
                }, {});
        },

        excelData (rows, parent = '') {
            return rows
                .reduce((excelRows, row, index) => {
                    let order = parent + (index + 1).toString() + '-';
                    row._order = order + (parent === '' ? '0' : '');
                    return excelRows.concat([
                        row,
                        ...(row && row._showChildren ? this.excelData(row._meta.visibleChildren, order) : []),
                    ]);
                }, []);
        },
    },
};
</script>
