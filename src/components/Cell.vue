<script>
import Row from '../models/Row';
import Column from '../models/Column';

import VueAdsChildrenButton from './ChildrenButton';

import ClassProcessor from '../services/ClassProcessor';

export default {
    name: 'VueAdsCell',

    components: {
        VueAdsChildrenButton,
    },

    props: {
        row: {
            type: Row,
            required: true,
        },

        rowIndex: {
            type: Number,
            required: true,
        },

        column: {
            type: Column,
            required: true,
        },

        classes: {
            type: ClassProcessor,
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
                this.classes.process(null, this.key, this.column),
                this.classes.process(this.rowIndex + 1, this.key, this.row, this.column),
                this.classes.processFixed(this.row.classes, this.key, this.row, this.column)
            );
        },

        style () {
            return {
                'padding-left': (1 + this.column.collapseIcon * this.row.countParents() * 1.5) + 'rem',
            };
        },

        key () {
            return this.$vnode.key || 0;
        },
    },

    methods: {
        value (createElement) {
            let elements = [];

            if (this.column.collapseIcon && this.row.hasChildren) {
                elements.push(createElement(VueAdsChildrenButton, {
                    props: {
                        expanded: this.row.showChildren,
                        loading: this.row.loading,
                    },
                    nativeOn: {
                        click: this.toggleChildren,
                    },
                }),);
            }

            if (this.columnSlot) {
                elements.push(this.columnSlot({
                    row: this.row.properties,
                }));
            } else if (this.column.property && this.row.properties.hasOwnProperty(this.column.property)) {
                elements.push(this.row.properties[this.column.property]);
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
