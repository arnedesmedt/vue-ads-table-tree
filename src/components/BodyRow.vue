<template>
    <tr
        :class="rowClasses"
    >
        <body-cell
            v-for="(column, key) in columns"
            :key="key"
            :row="row"
            :index="key"
            :column="column"
            :border="border"
            @toggleChildren="$emit('toggleChildren')"
        >

        </body-cell>
    </tr>
</template>

<script>
import Border from '../models/Border';
import Background from '../models/Background';
import Row from '../models/Row';
import BodyCell from './BodyCell';

export default {
    name: 'BodyRow',

    components: {
        BodyCell,
    },

    props: {
        border: {
            type: Border,
            required: true,
        },

        background: {
            type: Background,
            required: true,
        },

        row: {
            type: Row,
            required: true,
        },

        columns: {
            type: Array,
            required: true,
        },

        index: {
            type: Number,
            require: true,
        },

        last: {
            type: Boolean,
            required: false,
            default: false,
        },
    },

    computed: {
        rowClasses () {
            return Object.assign(
                this.background.classes(this.index),
                this.border.rowClasses(this.last),
            );
        },
    },
};
</script>
