<template>
    <i
        class="fa vue-ads-table-tree-pr-2 vue-ads-table-tree-cursor-pointer"
        :class="toggleChildrenButtonClasses"
    >
    </i>
</template>

<script>
export default {
    name: 'ToggleChildrenButton',

    props: {
        expanded: {
            type: Boolean,
            required: false,
            default: false,
        },

        loading: {
            type: Boolean,
            required: false,
            default: false,
        },
    },

    computed: {
        toggleChildrenButtonClasses () {
            return {
                'fa-plus-square': !this.expanded && !this.loading,
                'fa-minus-square': this.expanded && !this.loading,
                'fa-ellipsis-h': this.loading,
            };
        },
    },
};
</script>
