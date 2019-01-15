<script>
import VueAdsChildrenButton from './ChildrenButton';
import CSSProcessor from "../services/CSSProcessor";

export default {
    name: 'VueAdsCell',

    components: {
        VueAdsChildrenButton,
    },

    props: {
        row: {
            type: Object,
            required: true,
        },

        rowIndex: {
            type: Number,
            required: true,
        },

        column: {
            type: Object,
            required: true,
        },

        columnIndex: {
            type: Number,
            required: true,
        },

        cssProcessor: {
            type: CSSProcessor,
            required: true,
        },

        columnSlot: {
            type: Function,
            required: false,
            default: null,
        },
    },

    computed: {
        cellClasses () {
            return Object.assign(
                {
                    'vue-ads-px-4': true,
                    'vue-ads-py-2': true,
                    'vue-ads-text-sm': true,
                },
                this.cssProcessor.process(null, this.columnIndex, this.column),
                this.cssProcessor.process(this.rowIndex + 1, this.columnIndex, this.row, this.column),
                this.cssProcessor.processFixed(this.row.classes, this.columnIndex, this.row, this.column)
            );
        },

        style () {
            return {
                'padding-left': (1 + (this.column.collapseIcon ? 1 : 0) * (this.row.parent) * 1.5) + 'rem',
            };
        },
    },

    methods: {
        value (createElement) {
            let elements = [];

            if (this.column.collapseIcon && (this.row.hasChildren || this.row.children.length > 0)) {
                elements.push(createElement(VueAdsChildrenButton, {
                    props: {
                        expanded: this.row.showChildren || false,
                        loading: this.row.loading || false,
                    },
                    nativeOn: {
                        click: this.toggleChildren,
                    },
                }),);
            }

            if (this.columnSlot) {
                elements.push(this.columnSlot({
                    row: this.row,
                }));
            } else if (this.column.property && this.row.hasOwnProperty(this.column.property)) {
                elements.push(this.row[this.column.property]);
            }

            return elements.length > 0 ? elements : [
                '',
            ];
        },

        toggleChildren () {
            this.$emit('toggleChildren');
        },
    },

    render (createElement) {
        return createElement('td', {
            class: this.cellClasses,
            style: this.style,
        }, [
            createElement('span', {}, this.value(createElement)),
        ]);
    },
};
</script>
