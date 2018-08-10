export default class Cache {
    constructor (rowCollection, filterService, sortService, paginateService) {
        this.rowCollection = rowCollection;
        this.filterService = filterService;
        this.sortService = sortService;
        this.paginateService = paginateService;
    }

    set rowCollection (rowCollection) {
        this._rowCollection = rowCollection;
    }

    get rowCollection () {
        return this._rowCollection;
    }

    set filterService (filterService) {
        this._filterService = filterService;
    }

    get filterService () {
        return this._filterService;
    }

    set sortService (sortService) {
        this._sortService = sortService;
    }

    get sortService () {
        return this._sortService;
    }

    set paginateService (paginateService) {
        this._paginateService = paginateService;
    }

    get paginateService () {
        return this._paginateService;
    }

    store (rowCollection) {
        if (this.filterService.isFiltering() || this.sortService.hasSortedColumns()) {
            return;
        }

        this.rowCollection.addItemsFromIndex(rowCollection.items, this.paginateService.start);
    }
}
