import Vue from 'vue';

export default {
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
    },

    data () {
        return {
            tempRows: [],
            loading: false,
        };
    },

    watch: {
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

    computed: {
        allRowsLoaded () {
            return this.loadedRows.length === this.rows.length;
        },

        allRowsFullyLoaded () {
            return this.allRowsLoaded && !this.rows.find(this.noChildrenLoaded);
        },

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

        indexesToLoad () {
            let paginatedRows = this.currentRows.slice(this.start, this.end);

            return Array.from(paginatedRows)
                .map((row, index) => row === undefined ? index + this.start : undefined)
                .filter(index => index);
        },
    },

    methods: {
        noChildrenLoaded (row) {
            return row.hasOwnProperty('_hasChildren') && row._hasChildren;
        },

        async handleUnresolved () {
            this.loading = true;
            let result = await this.callTempRows(
                this.filter,
                this.sortColumns,
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
    },
};
