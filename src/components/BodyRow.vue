<template>
    <tr
        :class="styling.rowClasses(paginatedIndex, last)"
    >
        <body-cell
            v-for="(column, key) in columns"
            :key="key"
            :row="row"
            :index="key"
            :rowIndex="index"
            :column="column"
            :columnSlot="slots[column.property]"
            :styling="styling"
            @toggleChildren="$emit('toggleChildren')"
        >

        </body-cell>
    </tr>
</template>

<script>
import Row from '../models/Row';
import BodyCell from './BodyCell';
import Styling from '../models/Styling';

export default {
    name: 'BodyRow',

    components: {
        BodyCell,
    },

    props: {
        styling: {
            type: Styling,
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

        slots: {
            type: Object,
            required: false,
            default: () => {return {};},
        },

        index: {
            type: Number,
            require: true,
        },

        paginatedIndex: {
            type: Number,
            require: true,
        },

        last: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
};
</script>
