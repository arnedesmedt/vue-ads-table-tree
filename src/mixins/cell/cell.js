import VueAdsChildrenButton from '../../components/ChildrenButton';
import CSSProcessor from '../../services/CSSProcessor';


export default {
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
                'padding-left': (1 + (this.parent * 1.5)) + 'rem',
            };
        },

        parent () {
            let parent = 0;

            if (this.columnIndex === 0) {
                parent += this.row._meta.groupParent;
            }

            if (this.column.collapseIcon) {
                parent += this.row._meta.parent;
            }

            return parent;
        },

        collapsable () {
            return this.column.collapseIcon || this.groupCollapsable;
        },

        groupCollapsable () {
            return this.column.groupCollapsable && this.row._meta.groupColumn;
        },

        hasCollapseIcon () {
            return this.collapsable &&
                (this.row._meta.visibleChildren.length > 0 || this.row._hasChildren);
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
};
