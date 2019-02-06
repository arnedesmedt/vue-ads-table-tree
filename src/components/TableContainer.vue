<template>
    <div>
        <slot name="top"
              :filter="filter"
              :filter-changed="filterChanged"
        >
            <div class="vue-ads-flex vue-ads-p-3">
                <div class="vue-ads-w-4/5"></div>
                <div class="vue-ads-w-1/5">
                    <vue-ads-text :value="filter" placeholder="Filter..." @input="filterChanged"/>
                </div>
            </div>
        </slot>
        <component
            ref="table"
            :is="component"
            :columns="columns"
            :rows="rows"
            :filter="debouncedFilter"
            :start="start"
            :end="end"
            :call-rows="callRowsFunction"
            :call-children="callChildrenFunction"
            :call-temp-rows="callTempRowsFunction"
            :slots="$scopedSlots"
            @total-filtered-rows-change="totalFilteredRowsChanged"
        />
        <slot name="bottom"
              :total="total"
              :page="page"
              :itemsPerPage="itemsPerPage"
              :pageChanged="pageChanged"
              :rangeChanged="rangeChanged"
        >
            <vue-ads-pagination
                :total-items="total"
                :page="page"
                :items-per-page="itemsPerPage"
                @page-change="pageChanged"
                @range-change="rangeChanged"
            />
        </slot>
    </div>
</template>

<script>
import {
    VueAdsSelect,
    VueAdsText,
} from 'vue-ads-form-builder';
import VueAdsPagination from 'vue-ads-pagination';
import debounce from '../services/debounce';

import VueAdsTable from './Table';
import VueAdsAsyncTable from './AsyncTable';

import defaultClasses from '../services/defaultClasses';

export default {
    name: 'VueAdsTableContainer',

    components: {
        VueAdsTable,
        VueAdsAsyncTable,
        VueAdsText,
        VueAdsSelect,
        VueAdsPagination,
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

        classes: {
            type: Object,
            default: () => defaultClasses,
        },

        callRows: {
            type: Function,
        },

        callTempRows: {
            type: Function,
        },

        callChildren: {
            type: Function,
        },

        debounceFilterTime: {
            type: Number,
            default: 500,
        },

        page: {
            type: Number,
            default: 0,
        },
    },

    data () {
        return {
            itemsPerPage: 10,
            total: this.rows.length,
            start: null,
            end: null,
            debouncedFilter: this.filter,
            debounce: debounce(
                this.filterChange,
                this.debounceFilterTime
            ),
        };
    },

    watch: {
        filter: {
            handler: 'filterChanged',
            immediate: true,
        },
    },

    computed: {

        callRowsFunction () {
            return this.callRows || (() => []);
        },

        callTempRowsFunction () {
            return this.callTempRows || (() => []);
        },

        callChildrenFunction () {
            return this.callChildren || (() => []);
        },

        component () {
            return this.callRows ? VueAdsAsyncTable : VueAdsTable;
        },
    },

    methods: {
        filterChanged (filter) {
            if (this.callRows) {
                this.debounce(filter);

                return;
            }

            this.filterChange(filter);
        },

        async filterChange (filter) {
            this.debouncedFilter = filter;
            this.$emit('filter-change', filter);
            this.$emit('page-change', 0);
        },

        pageChanged (page) {
            this.$emit('page-change', page);
        },

        rangeChanged (start, end) {
            this.start = start;
            this.end = end;
        },

        totalFilteredRowsChanged (total) {
            this.total = total;
        },
    },
};
</script>
