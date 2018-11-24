<template>
    <tr
        :class="rowClasses"
    >
        <vue-ads-cell
            v-for="(column, key) in columns.items"
            slot="slot(column)"
            :key="key"
            :row-index="$vnode.key"
            :row="row"
            :column="column"
            :classes="classes"
            @toggleChildren="$emit('toggleChildren');"
        />
    </tr>
</template>

<script>
import Row from '../models/Row';
import VueAdsCell from './Cell';

import ClassProcessor from '../services/ClassProcessor';

export default {
    name: 'VueAdsRow',

    components: {
        VueAdsCell,
    },

    props: {
        row: {
            type: Row,
            required: true,
        },

        columns: {
            type: Object,
            required: true,
        },

        slots: {
            type: Object,
            required: false,
            default: () => { return {}; },
        },

        classes: {
            type: ClassProcessor,
            required: true,
        },
    },

    computed: {
        rowClasses () {
            return Object.assign(
                this.classes.process(this.$vnode.key + 1, null, this.row),
                this.row.classes ? ClassProcessor.processValue(this.row.classes.row, this.row) : {}
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
