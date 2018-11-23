
export default class ClassProcessor {
    constructor (classes, totalColumns) {
        this.totalColumns = totalColumns;
        this.classes = classes;
    }

    set classes (classes) {
        this._classes = classes;
        this.processClasses();
    }

    get classes () {
        return this._classes || [];
    }

    set totalRows (totalRows) {
        this._totalRows = totalRows;
        this.processClasses();
    }

    get totalRows () {
        return this._totalRows || 0;
    }

    set totalColumns (totalColumns) {
        this._totalColumns = totalColumns;
        this.processClasses();
    }

    get totalColumns () {
        return this._totalColumns || 0;
    }

    get processedClasses () {
        return this._processedClasses;
    }

    processClasses () {
        this._processedClasses = Object.keys(this.classes)
            .filter(key => key.includes('/'))
            .map(key => {
                let type = key.split('/');
                return {
                    rows: this.toRange(type[0], this.totalRows),
                    columns: this.toRange(type[1], this.totalColumns),
                    value: this.classes[key],
                };
            });
    }

    toRange (selector, total) {
        if (selector === '' || total === 0) {
            return [];
        }

        switch (selector) {
        case 'all':
            return Array.from(Array(total).keys());
        case 'even':
            return Array.from(Array(total).keys()).filter(item => (item % 2) === 0);
        case 'odd':
            return Array.from(Array(total).keys()).filter(item => (++item % 2) === 0);
        }

        return [].concat(
            ...selector.split(',')
                .map(selector => selector.trim())
                .map(selector => {
                    if (selector.includes('_')) {
                        let range = selector.split('_')
                            .map(index => Number.parseInt(index))
                            .map(index => index < 0 ? total + index : index);

                        if (range[0] < 0 || range[1] < 0 || range[0] > range[1]) {
                            return null;
                        }

                        return Array.from(Array(range[1] - range[0]).keys())
                            .map(number => number + range[0]);
                    }

                    return Number.parseInt(selector);
                })
                .filter(selector => selector !== null)
        );
    }

    process (rowIndex = null, columnIndex = null, ...args) {
        return this.processedClasses
            .map(classes => {
                if (
                    (rowIndex === null && columnIndex === null) ||
                    (columnIndex === null && classes.columns.length > 0) ||
                    (rowIndex === null && classes.rows.length > 0) ||
                    (columnIndex !== null && !classes.columns.includes(columnIndex)) ||
                    (rowIndex !== null && !classes.rows.includes(rowIndex))
                ) {
                    return null;
                }

                return ClassProcessor.processValue(classes.value, ...args);
            })
            .filter(classes => classes)
            .reduce((result, classes) => Object.assign(result, classes), {});
    }

    static processValue (classes, ...args) {
        if (classes instanceof Function) {
            return classes(...args);
        }

        if (classes) {
            return classes;
        }

        return {};
    }

    processFixed (classes, columnIndex, ...args) {
        if (!classes) {
            return {};
        }

        return Object.keys(classes)
            .map(key => {
                if (!this.toRange(key, this.totalColumns).includes(columnIndex)) {
                    return null;
                }

                return ClassProcessor.processValue(classes[key], ...args);
            })
            .filter(classes => classes)
            .reduce((result, classes) => Object.assign(result, classes), {});
    }
}
