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
import Border from '../models/Border';

export default {
    name: 'HeaderCell',

    props: {
        column: {
            type: Column,
            required: true,
        },

        sortColumn: {
            type: Object,
            required: false,
        },

        border: {
            type: Border,
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
                this.border.columnClasses(this.last),
                {
                    ['w-' + this.column.width]: true,
                }
            );
        },

        sortIconClasses () {
            return {
                'fa-sort': this.sortColumn && this.sortColumn.direction === null,
                'fa-sort-desc': this.sortColumn.direction === false,
                'fa-sort-asc': this.sortColumn.direction === true,
            };
        },
    },
};
</script>
