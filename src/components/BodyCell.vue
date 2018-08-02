<script>
import Border from '../models/Border';
import Row from '../models/Row';
import Column from '../models/Column';
import ToggleChildrenButton from './ToggleChildrenButton';

export default {
    name: 'BodyCell',

    components: {
        ToggleChildrenButton,
    },

    props: {
        border: {
            type: Border,
            required: true,
        },

        row: {
            type: Row,
            required: true,
        },

        column: {
            type: Column,
            required: true,
        },

        index: {
            type: Number,
            required: true,
        },
    },

    data () {
        return {
            // loading: false,
        };
    },

    render (createElement) {
        return createElement('td', {
            class: this.cellClasses,
            style: this.cellStyle,
        }, [
            createElement('span', {}, this.value(createElement)),
        ]);
    },

    computed: {
        cellClasses () {
            return Object.assign(
                this.border.columnClasses(this.column.last),
                {
                    'px-4': true,
                    'py-2': true,
                    'text-sm': true,
                    ['w-' + this.column.width]: true,
                }
            );
        },

        cellStyle () {
            let paddingLeft = 1 + this.first * this.row.countParents() * 1.5;

            return {
                'padding-left': paddingLeft + 'rem',
            };
        },

        first () {
            return this.index === 0;
        },

        // isLoading () {
        //     return this.loading && this.row.children.isEmpty() && this.row.processedChildren.isEmpty();
        // },
    },

    methods: {
        value (createElement) {
            let elements = [];

            if (this.first && this.row.hasChildren) {
                elements.push(
                    createElement(ToggleChildrenButton, {
                        props: {
                            expanded: this.row.showChildren,
                            // loading: this.loading,
                        },
                        nativeOn: {
                            'click': this.toggleChildren,
                        },
                    }),
                );
            }

            if (this.column.property && this.row.hasOwnProperty(this.column.property)) {
                elements.push(this.row[this.column.property]);
            }

            return elements.length > 0 ? elements : [''];
        },

        toggleChildren () {
            // this.loading = this.row.hasLoadedChildren();
            this.$emit('toggleChildren');
        },
    },
};
</script>
