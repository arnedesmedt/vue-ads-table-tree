export default {
    props: {
        filter: {
            type: String,
            default: '',
        },
    },

    computed: {
        isFiltering () {
            return this.filter !== '' && this.filterColumnProperties.length > 0;
        },
    },
};
