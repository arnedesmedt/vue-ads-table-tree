export default class RowConnection {
    static maxConsecutiveCalls = 20;

    constructor (callable) {
        this.callable = callable;
        this.loading = false;
        this.consecutiveCalls = 0;
    }

    set callable (callable) {
        if (!(callable instanceof Function)) {
            throw new Error(
                'Callable to get async rows has to be a function. \'' + typeof callable + '\' given.'
            );
        }

        this._callable = callable;
    }

    get callable () {
        return this._callable;
    }

    get loading () {
        return this._loading;
    }

    set loading (loading) {
        this._loading = loading;
    }

    get consecutiveCalls () {
        return this._consecutiveCalls;
    }

    set consecutiveCalls (consecutiveCalls) {
        this._consecutiveCalls = consecutiveCalls;
    }

    async resolve (range, filter, sortColumns, parent = null) {
        this.addCall();
        this.checkConsecutiveCalls();

        this.loading = true;
        let result = await this.callable(range, filter, sortColumns, parent);
        this.loading = false;

        return result;
    }

    addCall () {
        this.consecutiveCalls = this.consecutiveCalls + 1;
    }

    resetCalls () {
        this.consecutiveCalls = 0;
    }

    checkConsecutiveCalls () {
        if (this.consecutiveCalls > RowConnection.maxConsecutiveCalls) {
            throw new Error(
                'Too much async calls. Prevent loading the children by setting showChildren to false.'
            );
        }
    }

    callChildRows (parentRow) {
        // let result = await this.resolve();
    }
}
