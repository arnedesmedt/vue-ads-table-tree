<template>
    <div>
        <slot name="top"
              :filter="filter"
              :filter-changed="filterChanged"
        >
            <div class="vue-ads-flex vue-ads-py-3">
                <div class="vue-ads-w-3/4"></div>
                <div class="vue-ads-w-1/4 vue-ads-flex">
                    <vue-ads-form
                        :class="filterClasses"
                        :style="{'min-width': 0}"
                    >
                        <vue-ads-form-group>
                            <vue-ads-text :value="filter" placeholder="Filter..." @input="filterChanged" :style="{'min-width': 0}"/>
                        </vue-ads-form-group>
                    </vue-ads-form>
                    <vue-json-excel
                        v-if="exportName"
                        :data="exportData"
                        :fields="exportFields"
                        :name="`${exportTitle}.xls`"
                        :before-generate="collectExportData"
                        class="vue-ads-text-white vue-ads-p-2 vue-ads-cursor-pointer vue-ads-rounded-sm vue-ads-bg-teal-500"
                    >
                        <i class="fa fa-file-download"></i>
                    </vue-json-excel>
                </div>
            </div>

        </slot>
        <vue-ads-table
            ref="table"
            :columns="columns"
            :rows="rows"
            :filter="debouncedFilter"
            :selectable="selectable"
            :start="start"
            :end="end"
            :classes="classes"
            :call-rows="callRowsFunction"
            :call-children="callChildrenFunction"
            :call-temp-rows="callTempRowsFunction"
            :slots="$scopedSlots"
            @total-filtered-rows-change="totalFilteredRowsChanged"
            @export="exportTable"
            @selection-change="selectionChanged"
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
                :with-input="withPageInput"
                @page-change="pageChanged"
                @range-change="rangeChanged"
            />
        </slot>
    </div>
</template>

<script>
import {
    VueAdsForm,
    VueAdsFormGroup,
    VueAdsText,
} from 'vue-ads-form-builder';
import VueAdsPagination from 'vue-ads-pagination';
import VueJsonExcel from 'vue-json-excel';
import debounce from '../services/debounce';

import VueAdsTable from './Table';

import defaultClasses from '../services/defaultClasses';
import 'vue-ads-pagination/dist/vue-ads-pagination.css';

export default {
    name: 'VueAdsTableContainer',

    components: {
        VueAdsTable,
        VueAdsText,
        VueAdsForm,
        VueAdsFormGroup,
        VueAdsPagination,
        VueJsonExcel,
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

        selectable: {
            type: Boolean,
            default: false,
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

        itemsPerPage: {
            type: Number,
            default: 10,
        },

        withPageInput: {
            type: Boolean,
            default: false,
        },

        exportName: {
            type: String,
            default: '',
        },

        fullExport: {
            type: Boolean,
            default: true,
        },
    },

    data () {
        return {
            total: this.rows.length,
            start: null,
            end: null,
            debouncedFilter: this.filter,
            debounce: debounce(
                this.filterChange,
                this.debounceFilterTime
            ),
            exportData: [],
            exportFields: {},
            exportTitle: '',
        };
    },

    watch: {
        rows: 'rowsChanged',

        filter: {
            handler: 'filterChanged',
            immediate: true,
        },
    },

    computed: {
        hasExport () {
            return this.exportName.length > 0;
        },

        filterClasses () {
            return {
                'vue-ads-flex-grow': true,
                'vue-ads-mr-2 ': this.hasExport,
            };
        },

        callRowsFunction () {
            return this.callRows || (() => []);
        },

        callTempRowsFunction () {
            return this.callTempRows || (() => []);
        },

        callChildrenFunction () {
            return this.callChildren || (() => []);
        },
    },

    methods: {
        rowsChanged () {
            this.total = this.rows.length;
        },

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

        selectionChanged (rows) {
            this.$emit('selection-change', rows);
        },

        collectExportData () {
            this.$refs.table.exportTable(this.exportName, this.fullExport);
        },

        exportTable (exportData) {
            this.exportFields = exportData.fields;
            this.exportData = exportData.data;
            this.exportTitle = exportData.title;
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
