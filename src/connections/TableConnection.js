export default class TableConnection {
    static maxConsecutiveCalls = 10;

    constructor (callable, filterService, sortService, paginateService) {
        this.callable = callable;

        this.filterService = filterService;
        this.sortService = sortService;
        this.paginateService = paginateService;

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

    set filterService (filterService) {
        this._filterService = filterService;
    }

    get filterValue () {
        return this._filterService.filterValue;
    }

    set sortService (sortService) {
        this._sortService = sortService;
    }

    get sortColumns () {
        return this._sortService.sortColumns;
    }

    set paginateService (paginateService) {
        this._paginateService = paginateService;
    }

    get range () {
        return this._paginateService.range;
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
        if (this.consecutiveCalls > TableConnection.maxConsecutiveCalls) {
            throw new Error(
                'Too much async calls. Prevent loading the children by setting showChildren to false.'
            );
        }
    }

    async callChildRows (parentRow) {
        let result = await this.resolve(this.range, this.filterValue, this.sortColumns, parentRow);

        return result.rows;
    }

    async callRootRows () {
        let result = await this.resolve(this.range, this.filterValue, this.sortColumns);

        return result;
    }
}
