<template>
    <i
        class="fa vue-ads-pr-2 vue-ads-cursor-pointer"
        :class="classes"
    >
    </i>
</template>

<script>
export default {
    name: 'VueAdsChildrenButton',

    props: {
        expanded: {
            type: Boolean,
            required: true,
        },

        loading: {
            type: Boolean,
            required: true,
        },
    },

    computed: {
        classes () {
            if (this.loading) {
                return {
                    'fa-ellipsis-h': true,
                };
            }

            return {
                'fa-plus-square': !this.expanded,
                'fa-minus-square': this.expanded,
            };
        },
    },
};
</script>
