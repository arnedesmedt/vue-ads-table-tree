export default {
    props: {
        start: {
            type: Number,
            validator: start => {
                return start >= 0;
            },
        },

        end: {
            type: Number,
            validator: end => {
                return end >= 0;
            },
        },
    },
};
