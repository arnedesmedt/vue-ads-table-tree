<script>
import cell from '../mixins/cell/cell';
import sortCell from '../mixins/cell/sortCell';


export default {
    name: 'VueAdsGroupCell',

    mixins: [
        cell,
        sortCell,
    ],

    computed: {
        containerClasses () {
            return {
                'vue-ads-flex': true,
            };
        },

        groupTitleClasses () {
            return Object.assign(
                this.titleClasses,
                {
                    'vue-ads-flex-grow': true,
                }
            );
        },

        disableGroupIconClasses () {
            return {
                fa: true,
                'fa-times-circle': true,
                'vue-ads-cursor-pointer': true,
            };
        },

        disableGroupClickEvents () {
            return {
                click: this.disableGroup,
            };
        },
    },

    methods: {
        disableGroup (event) {
            event.stopPropagation();
            this.$emit('disable-group', this.column);
        },

        groupValue (createElement) {
            let elements = this.value(createElement);

            if (this.sortable) {
                elements.push(this.sortIcon(createElement));
            }

            return elements;
        },
    },

    render (createElement) {
        return createElement('td', {
            class: this.cellClasses,
            style: this.style,
        }, [
            createElement('div', {
                class: this.containerClasses,
            }, [
                createElement('span', {
                    class: this.groupTitleClasses,
                    on: this.clickEvents,
                }, this.groupValue(createElement)),
                createElement('i', {
                    class: this.disableGroupIconClasses,
                    on: this.disableGroupClickEvents,
                }),
            ]),
        ]);
    },
};
</script>
