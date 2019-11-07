import defaultClasses from '../services/defaultClasses';
import CSSProcessor from '../services/CSSProcessor';

export default {
    props: {
        classes: {
            type: Object,
            default: () => defaultClasses,
        },
    },

    watch: {
        classes: {
            handler: 'classesChanged',
        },
    },

    data () {
        return {
            cssProcessor: new CSSProcessor(this.columns.length, this.classes),
        };
    },

    computed: {
        tableClasses () {
            let classes = this.classes.table || {};
            if (this.selection) {
                classes['vue-ads-select-none'] = true;
            }
            return classes;
        },

        headerRowClasses () {
            return this.cssProcessor.process(0);
        },

        infoClasses () {
            return this.classes.info || {};
        },
    },

    methods: {
        classesChanged (classes)  {
            this.cssProcessor.classes = classes;
        },
    },
};
