export default {
    props: {
        selectable: {
            type: String,
            validator: function (value) {
                if (value !== undefined) {
                    return [
                        'single',
                        'multi',
                    ].indexOf(value) !== -1;
                }
                return true;
            },
        },
    },

    data () {
        return {
            firstSelectedRowId: undefined,
        };
    },

    computed: {
        multiSelect () {
            return this.selectable === 'multi';
        },
    },

    methods: {
        clearSelection () {
            this.flatten(this.currentRows).forEach(row => row._meta.selected = false);
        },

        selectRows (rows) {
            rows.forEach(row => {
                if (row._selectable) {
                    row._meta.selected = true;
                }
            });
        },

        selectRow (event, row, key) {
            if (! row._selectable) {
                return;
            }

            if (event.shiftKey && this.multiSelect) {
                let flatten = this.flatten(this.currentRows);
                let indexes = [
                    row._meta.uniqueIndex,
                    this.firstSelectedRowIndex,
                ];
                let minKey = Object.keys(flatten).find((key) => flatten[key]._meta.uniqueIndex === indexes[0]);
                let maxKey = Object.keys(flatten).find((key) => flatten[key]._meta.uniqueIndex === indexes[1]);
                let keys = [
                    +minKey,
                    +maxKey,
                ];
                [
                    minKey,
                    maxKey,
                ] = keys.sort((a, b) => a - b);

                this.clearSelection();
                this.selectRows(flatten.slice(minKey, maxKey + 1));
            } else if (event.ctrlKey) {
                let oldSelected = row._meta.selected;
                if (! this.multiSelect) {
                    this.clearSelection();
                }
                this.firstSelectedRowIndex = row._meta.uniqueIndex;
                row._meta.selected = ! oldSelected;
            } else {
                this.clearSelection();
                this.firstSelectedRowIndex = row._meta.uniqueIndex;
                row._meta.selected = true;
            }

            this.$emit('selection-change', this.flatten(this.currentRows).filter(row => row._meta.selected));
        },
    },
};