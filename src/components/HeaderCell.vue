<template>
    <th
        :class="headerClasses"
        class=""
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

import CSSProcessor from '../services/CSSProcessor';

export default {
    name: 'VueAdsHeaderCell',

    props: {
        title: {
            type: String,
            default: '',
        },

        columnIndex: {
            type: Number,
            required: true,
        },

        sortable: {
            type: Boolean,
            default: false,
        },

        direction: {
            type: [
                Boolean,
                null,
            ],
            default: null,
        },

        cssProcessor: {
            type: CSSProcessor,
            required: true,
        },
    },

    computed: {
        headerClasses () {
            return Object.assign(
                {
                    'vue-ads-cursor-pointer': [
                        null,
                        true,
                        false,
                    ].includes(this.direction) && this.sortable,
                },
                this.cssProcessor.process(null, this.columnIndex),
                this.cssProcessor.process(0, this.columnIndex),
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
