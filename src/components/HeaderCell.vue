<template>
    <th
        class="vue-ads-px-4 vue-ads-py-2 vue-ads-text-left vue-ads-cursor-pointer"
        :class="headerClasses"
        @click="$emit('sort')"
    >
        <div class="vue-ads-flex">
            <span class="vue-ads-flex-grow ">
                {{ title }}
            </span>
            <i
                v-if="sortable"
                class="vue-ads-ml-2 fa "
                :class="sortIconClasses"
            ></i>
        </div>
    </th>
</template>

<script>

import ClassProcessor from '../services/ClassProcessor';

export default {
    name: 'VueAdsHeaderCell',

    props: {
        width: {
            type: [Number, String],
            required: false,
            default: 'auto',
        },

        title: {
            type: String,
            required: false,
            default: '',
        },

        sortable: {
            type: Boolean,
            required: false,
            default: false,
        },

        direction: {
            type: Boolean,
            required: false,
            default: false,
        },

        classes: {
            type: ClassProcessor,
            required: true,
        },
    },

    computed: {
        headerClasses () {
            return Object.assign(
                {
                    ['vue-ads-w-' + this.width]: true,
                },
                this.classes.process(null, this.$vnode.key),
                this.classes.process(0, this.$vnode.key),
            );
        },

        sortIconClasses () {
            if (!this.sortable) {
                return {};
            }

            return {
                'fa-sort': this.direction === null,
                'fa-sort-down': this.direction === false,
                'fa-sort-up': this.direction === true,
            };
        },
    },
};
</script>
