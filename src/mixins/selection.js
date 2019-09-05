import Vue from 'vue';

export default {
    props: {
        selection: {
            type: Boolean,
            default: true,
        },
    },

    data () {
        return {
            selectedRows: [],
            lastSelectedRow: undefined,
        };
    },

    methods: {
        clearSelection () {
            if (!this.selection) {
                return;
            }

            this.selectedRows = [];
            this.$emit('selection-change', []);
        },

        setSelection (event, rowIndex) {
            if (!this.selection) {
                return;
            }


            if (event.ctrlKey) {
                Vue.set(this.selectedRows, rowIndex, !this.selectedRows[rowIndex]);
            }
            else if (event.shiftKey) {
                let minIndex = Math.min(rowIndex, this.lastSelectedRow);
                let maxIndex = Math.max(rowIndex, this.lastSelectedRow);
                for (let i=0; i<this.selectedRows.length; i++) {
                    Vue.set(this.selectedRows, i, (i >= minIndex && i <= maxIndex));
                }
            }
            else {
                for (let i=0; i<this.selectedRows.length; i++) {
                    Vue.set(this.selectedRows, i, false);
                }
                Vue.set(this.selectedRows, rowIndex, true);
            }

            if (this.selectedRows[rowIndex]) {
                this.lastSelectedRow = rowIndex;
            }

            this.$emit('selection-change', this.flattenedRows.filter((row, index) => {
                return this.selectedRows[index] && !row._meta.groupColumn;
            }));
        },
    },
};