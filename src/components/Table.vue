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
                    @toggle-children="toggleChildren(row)"
                />
            </template>
        </tbody>
    </table>
</template>

<script>
import rows from '../mixins/rows';
import columns from '../mixins/columns';
import filter from '../mixins/filter';
import slots from '../mixins/slots';
import pagination from '../mixins/pagination';
import styling from '../mixins/styling';
import async from '../mixins/async';
import sort from '../mixins/sort';
import flatten from '../mixins/flatten';
import exportData from '../mixins/exportData';

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
        slots,
        filter,
        sort,
        pagination,
        flatten,
        styling,
        async,
        exportData,
    ],

    computed: {
        totalVisibleRows () {
            return this.flattenedRows.length;
        },

        infoVisible () {
            return this.totalVisibleRows === 0 || this.loading;
        },
    },

    watch: {
        totalVisibleRows: {
            handler: 'totalVisibleRowsChanged',
            immediate: true,
        },
    },

    methods: {
        totalVisibleRowsChanged (totalVisibleRows) {
            this.cssProcessor.totalRows = totalVisibleRows === 0 ? 2 : totalVisibleRows + 1;
        },
    },
};
</script>
