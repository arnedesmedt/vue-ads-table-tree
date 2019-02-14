<template>
    <vue-ads-table
        ref="table"
        :columns="columns"
        :rows="filteredCurrentRows"
        :filter="filter"
        :start="start"
        :end="end"
        :classes="classes"
        :loading="loading"
        :excel="excel"
        :slots="currentSlots"
        :temp="unresolved"
        @total-filtered-rows-change="totalFilteredRowsChanged"
        @toggle-children="toggleChildren"
        @sort="sort"
        @excel="excel"
    />
</template>

<script>
import Vue from 'vue';
import VueAdsTable from './Table';
import rows from '../mixins/rows';
import columns from '../mixins/columns';
import filter from '../mixins/filter';
import slots from '../mixins/slots';
import pagination from '../mixins/pagination';
import styling from '../mixins/styling';

export default {
    name: 'VueAdsAsyncTable',

    components: {
        VueAdsTable,
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
        callRows: {
            type: Function,
            default: () => [],
        },

        callTempRows: {
            type: Function,
            default: () => [],
        },

        callChildren: {
            type: Function,
            default: () => [],
        },

        excel: {
            type: Boolean,
            default: false,
        },
    },

    data () {
        return {
            tempRows: [],
            loading: false,
        };
    },

    computed: {
        unresolved () {
            return (
                (this.isFiltering && !this.allRowsFullyLoaded) ||
                (this.sortColumns.length > 0 && !this.allRowsLoaded)
            );
        },

        currentRows () {
            // this.loading because tempRows is empty while loading
            // this will trigger an total-filtered-rows-change of 0
            if (!this.unresolved || this.loading) {
                return this.rows;
            }

            return this.tempRows;
        },

        filteredCurrentRows () {
            return this.unresolved ? this.currentRows.filter(row => row) : this.currentRows;
        },

        indexesToLoad () {
            let paginatedRows = this.currentRows.slice(this.start, this.end);

            return Array.from(paginatedRows)
                .map((row, index) => row === undefined ? index + this.start : undefined)
                .filter(index => index);
        },

        allRowsLoaded () {
            return this.rows.filter(row => row).length === this.rows.length;
        },

        allRowsFullyLoaded () {
            return this.allRowsLoaded && !this.rows.find(this.noChildrenLoaded);
        },
    },

    watch: {
        filter: {
            handler: 'filterChanged',
            immediate: true,
        },

        async indexesToLoad () {
            if (this.indexesToLoad.length === 0) {
                return;
            }

            if (!this.unresolved) {
                return await this.loadRows();
            }

            return await this.handleUnresolved();
        },
    },

    methods: {
        noChildrenLoaded (row) {
            return row.hasOwnProperty('_hasChildren') && row._hasChildren;
        },

        async filterChanged (filter) {
            if (this.unresolved) {
                await this.handleUnresolved();
            }
        },

        async sort () {
            if (this.unresolved) {
                await this.handleUnresolved();
            }
        },

        async handleUnresolved () {
            this.loading = true;
            let result = await this.callTempRows(
                this.filter,
                this.$refs.table.sortColumns,
                this.start,
                this.end
            );

            let rows = Array.apply(null, Array(result.total || result.rows.length));
            rows.splice(
                this.start,
                this.end,
                ...result.rows
            );
            this.tempRows = rows;
            this.totalFilteredRowsChanged(result.total || result.rows.length);
            this.loading = false;
        },

        totalFilteredRowsChanged (total) {
            this.$emit('total-filtered-rows-change', total);
        },

        async toggleChildren (parent) {
            if (!parent._hasChildren) {
                return;
            }

            parent._meta.loading = true;
            parent._children = this.initRows(await this.callChildren(parent), parent);
            Vue.delete(parent, '_hasChildren');
            parent._meta.loading = false;
        },

        async loadRows () {
            this.loading = true;
            let rows = this.initRows(await this.callRows(this.indexesToLoad));

            let key;
            for (key in rows) {
                this.rows[this.indexesToLoad[key]] = rows[key];
            }

            Vue.set(this.rows, this.indexesToLoad[key], rows[key]);
            this.loading = false;
        },

        excel (excel) {
            this.$emit('excel', excel);
        },
    },
};
</script>
