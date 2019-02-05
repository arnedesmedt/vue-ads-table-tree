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

        iconSlot: {
            type: Function,
            default: null,
        },
    },

    computed: {
        classes () {
            let classes = {
                fa: true,
                'vue-ads-pr-2': true,
            };

            if (this.loading) {
                return Object.assign(
                    classes,
                    {
                        fa: true,
                        'fa-ellipsis-h': true,
                    }
                );
            }

            return Object.assign(
                classes,
                {
                    'vue-ads-cursor-pointer': true,
                    'fa-plus-square': !this.expanded,
                    'fa-minus-square': this.expanded,
                }
            );
        },
    },

    render (createElement) {
        if (this.iconSlot) {
            return createElement(
                'span',
                {},
                this.iconSlot({
                    expanded: this.expanded,
                    loading: this.loading,
                })
            );
        }

        return createElement(
            'i',
            {
                class: this.classes,
            }
        );
    },
};
</script>
