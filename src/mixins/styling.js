import defaultClasses from '../services/defaultClasses';

export default {
    props: {
        classes: {
            type: Object,
            default: () => defaultClasses,
        },
    },
};
