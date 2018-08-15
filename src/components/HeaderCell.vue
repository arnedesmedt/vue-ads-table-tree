<template>
    <th
        class="px-4 py-2 text-left cursor-pointer"
        :class="headerClasses"
        @click="$emit('sort')"
    >
        <div class="flex">
            <span class="flex-grow">
                {{ column.title || '' }}
            </span>
            <i
                v-if="column.sortable"
                class="ml-2 fa leading-normal"
                :class="sortIconClasses"
            ></i>
        </div>
    </th>
</template>

<script>
import Column from '../models/Column';
import Styling from '../models/Styling';

export default {
    name: 'HeaderCell',

    props: {
        column: {
            type: Column,
            required: true,
        },

        index: {
            type: Number,
            required: true,
        },

        styling: {
            type: Styling,
            required: true,
        },

        last: {
            type: Boolean,
            required: false,
            default: false,
        },
    },

    computed: {
        headerClasses () {
            return Object.assign(
                this.styling.columnClasses(this.index, this.last),
                {
                    ['w-' + this.column.width]: true,
                }
            );
        },

        sortIconClasses () {
            return {
                'fa-sort': this.column.sortable && this.column.direction === null,
                'fa-sort-desc': this.column.sortable && this.column.direction === false,
                'fa-sort-asc': this.column.sortable && this.column.direction === true,
            };
        },
    },
};
</script>
