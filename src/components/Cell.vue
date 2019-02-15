<script>
import VueAdsChildrenButton from './ChildrenButton';
import CSSProcessor from '../services/CSSProcessor';

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
            default: null,
        },

        toggleChildrenIconSlot: {
            type: Function,
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
                this.cssProcessor.processFixed(this.row._classes, this.columnIndex, this.row, this.column)
            );
        },

        titleClasses () {
            return {
                'vue-ads-cursor-pointer': this.hasCollapseIcon,
            };
        },

        style () {
            return {
                'padding-left': (1 + (this.column.collapseIcon ? 1 : 0) * (this.row._meta.parent) * 1.5) + 'rem',
            };
        },

        hasCollapseIcon () {
            return this.column.collapseIcon && (this.row._meta.visibleChildren.length > 0 || this.row._hasChildren);
        },

        clickEvents () {
            return this.hasCollapseIcon ? {
                click: this.toggleChildren,
            } : {};
        },
    },

    methods: {
        value (createElement) {
            let elements = [];

            if (this.hasCollapseIcon) {
                elements.push(createElement(VueAdsChildrenButton, {
                    props: {
                        expanded: this.row._showChildren || false,
                        loading: this.row._meta.loading || false,
                        iconSlot: this.toggleChildrenIconSlot,
                    },
                    nativeOn: this.clickEvents,
                }));
            }

            if (this.columnSlot) {
                elements.push(this.columnSlot({
                    row: this.row,
                    column: this.column,
                }));
            } else if (this.column.property && this.row.hasOwnProperty(this.column.property)) {
                elements.push(this.row[this.column.property]);
            }

            return elements.length > 0 ? elements : [
                '',
            ];
        },

        toggleChildren (event) {
            event.stopPropagation();
            this.$emit('toggle-children');
        },
    },

    render (createElement) {

        return createElement('td', {
            class: this.cellClasses,
            style: this.style,
        }, [
            createElement('span', {
                class: this.titleClasses,
                on: this.clickEvents,
            }, this.value(createElement)),
        ]);
    },
};
</script>
