export default (fn, time = 300) => {
    // Store active timeout
    let timeout;

    return (...args) => {
        clearTimeout(timeout);

        // Start a new timeout
        timeout = setTimeout(fn.bind(null, ...args), time);
    };
};
