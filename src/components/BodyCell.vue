<script>
import Row from '../models/Row';
import Column from '../models/Column';
import ToggleChildrenButton from './ToggleChildrenButton';
import Styling from '../models/Styling';

export default {
    name: 'BodyCell',

    components: {
        ToggleChildrenButton,
    },

    props: {
        styling: {
            type: Styling,
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
                this.styling.columnClasses(0, this.column.last),
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
    },

    methods: {
        value (createElement) {
            let elements = [];

            if (this.first && this.row.hasChildren) {
                elements.push(
                    createElement(ToggleChildrenButton, {
                        props: {
                            expanded: this.row.showChildren,
                            loading: this.row.childrenLoading,
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
            this.$emit('toggleChildren');
        },
    },
};
</script>
