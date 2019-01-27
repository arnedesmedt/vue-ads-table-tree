<template>
    <tr
        :class="rowClasses"
    >
        <vue-ads-cell
            v-for="(column, key) in columns"
            :column-slot="columnSlot(column)"
            :key="key"
            :row-index="rowIndex"
            :column-index="key"
            :row="row"
            :column="column"
            :css-processor="cssProcessor"
            @toggleChildren="$emit('toggleChildren')"
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
    },

    computed: {
        rowClasses () {
            return Object.assign(
                this.cssProcessor.process(this.rowIndex + 1, null, this.row),
                this.row.classes ? CSSProcessor.processValue(this.row.classes.row, this.row) : {}
            );
        },
    },

    methods: {
        columnSlot (column) {
            return this.slots[column.property + '_' + this.row[column.property]] ||
                this.slots[column.property] ||
                null;
        },
    },
};
</script>
