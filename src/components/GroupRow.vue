<template>
    <tr
        :class="rowClasses"
    >
        <vue-ads-group-cell
            :colspan="colspan"
            :column-slot="columnSlot(row._meta.groupColumn)"
            :toggle-children-icon-slot="toggleChildrenIconSlot"
            :row-index="rowIndex"
            :column-index="0"
            :row="row"
            :column="row._meta.groupColumn"
            :css-processor="cssProcessor"
            @toggle-children="$emit('toggle-children')"
            @disable-group="$emit('disable-group', $event)"
            @sort="$emit('sort', $event)"
        />
    </tr>
</template>

<script>
import VueAdsGroupCell from './GroupCell';
import CSSProcessor from '../services/CSSProcessor';

export default {
    name: 'VueAdsGroupRow',

    components: {
        VueAdsGroupCell,
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

        colspan: {
            type: Number,
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
