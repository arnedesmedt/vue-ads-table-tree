<template>
    <th
        :class="headerClasses"
        class="vue-ads-px-4 vue-ads-py-2 vue-ads-text-left"
        @click="$emit('sort')"
    >
        <div class="vue-ads-flex">
            <span class="vue-ads-flex-grow ">
                {{ title }}
            </span>
            <i
                v-if="sortable"
                :class="sortIconClasses"
                class="vue-ads-ml-2 fa "
            />
        </div>
    </th>
</template>

<script>

import ClassProcessor from '../services/ClassProcessor';

export default {
    name: 'VueAdsHeaderCell',

    props: {
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
                    'vue-ads-cursor-pointer': this.sortable,
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
