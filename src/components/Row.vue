<template>
    <tr
        :class="rowClasses"
    >
        <vue-ads-cell
            v-for="(column, key) in columns"
            :column-slot="columnSlot(column)"
            :toggle-children-icon-slot="toggleChildrenIconSlot"
            :key="key"
            :row-index="rowIndex"
            :column-index="key"
            :row="row"
            :column="column"
            :css-processor="cssProcessor"
            @toggle-children="$emit('toggle-children')"
        />
    </tr>
</template>

<script>
import VueAdsCell from './Cell';
import CSSProcessor from '../services/CSSProcessor';

export default {
    name: 'VueAdsRow',

    components: {
        VueAdsCell,
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

        selected: {
            type: Boolean,
            default: false,
        },

        columns: {
            type: Array,
            required: true,
        },

        slots: {
            type: Object,
            default: () => { return {}; },
        },

        cssProcessor: {
            type: CSSProcessor,
            required: true,
        },

        toggleChildrenIconSlot: {
            type: Function,
            default: null,
        },
    },

    computed: {
        rowClasses () {
            if (this.selected) {
                return this.cssProcessor.classes.selection;
            }
            
            if (this.row._meta.groupColumn) {
                return this.cssProcessor.classes.group;
            }

            return Object.assign(
                this.cssProcessor.process(this.rowIndex + 1, null, this.row),
                this.row._classes ? CSSProcessor.processValue(this.row._classes.row, this.row) : {}
            );
        },
    },

    methods: {
        columnSlot (column) {
            return this.slots[column.property + '_' + (this.row['_id'] || '')] ||
                this.slots[column.property] ||
                this.slots['_' + (this.row['_id'] || '')] ||
                null;
        },
    },
};
</script>
