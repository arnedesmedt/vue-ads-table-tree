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

        sortIconSlot: {
            type: Function,
            default: null,
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
                fa: true,
                'vue-ads-ml-2': true,
                'fa-sort': this.direction === null,
                'fa-sort-down': this.direction === false,
                'fa-sort-up': this.direction === true,
            };
        },
    },

    render (createElement) {
        let headerContent = [
            createElement(
                'span',
                {
                    class: {
                        'vue-ads-flex-grow': true,
                    },
                },
                [
                    this.title,
                ],
            ),
        ];

        if (this.sortable) {
            headerContent.push(this.sortIconSlot ?
                this.sortIconSlot({
                    direction: this.direction,
                }) :
                createElement(
                    'i',
                    {
                        class: this.sortIconClasses,
                    },
                ));
        }

        return createElement(
            'th',
            {
                class: this.headerClasses,
                on: {
                    click: (event) => this.$emit('sort'),
                },
            },
            [
                createElement(
                    'div',
                    {
                        class: {
                            'vue-ads-flex': true,
                        },
                    },
                    headerContent,
                ),
            ]
        );
    },
};
</script>
