<template>
    <i
        class="fa pr-2"
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
