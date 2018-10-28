<template>
    <th
        class="vue-ads-table-tree-px-4 vue-ads-table-tree-py-2 vue-ads-table-tree-text-left vue-ads-table-tree-cursor-pointer"
        :class="headerClasses"
        @click="$emit('sort')"
    >
        <div class="vue-ads-table-tree-flex">
            <span class="vue-ads-table-tree-flex-grow">
                {{ column.title || '' }}
            </span>
            <i
                v-if="column.sortable"
                class="vue-ads-table-tree-ml-2 vue-ads-table-tree-fa vue-ads-table-tree-leading-normal"
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
                    ['vue-ads-table-tree-w-' + this.column.width]: true,
                }
            );
        },

        sortIconClasses () {
            return {
                'vue-ads-table-tree-fa-sort': this.column.sortable && this.column.direction === null,
                'vue-ads-table-tree-fa-sort-desc': this.column.sortable && this.column.direction === false,
                'vue-ads-table-tree-fa-sort-asc': this.column.sortable && this.column.direction === true,
            };
        },
    },
};
</script>
