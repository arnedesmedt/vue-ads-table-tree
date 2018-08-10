import RowCollection from '../collections/RowCollection';

export default class RowRepository {
    constructor (connection) {
        this.connection = connection;
    }

    set connection (connection) {
        this._connection = connection;
    }

    get connection () {
        return this._connection;
    }

    set callable (callable) {
        this.connection.callable = callable;
    }

    async callRootRows () {
        let result = await this.connection.callRootRows();
        this.connection.resetCalls();

        return {
            total: result.total,
            rows: await this.fillChildRows(result.rows),
        };
    }

    async callChildRows (parent) {
        parent.childrenLoading = true;
        let childRows = await this.callChildRowsWithoutReset(parent);
        parent.childrenLoading = false;
        this.connection.resetCalls();

        return childRows;
    }

    async callChildRowsWithoutReset (parent) {
        let result = await this.connection.callChildRows(parent);

        return await this.fillChildRows(result);
    }

    async fillChildRows (rows) {
        let rowCollection = new RowCollection(rows);

        await rowCollection.items.forEach(async function (row) {
            if (row.loadChildren()) {
                row.children = await this.callChildRowsWithoutReset(row);
            }
        }, this);

        return rowCollection;
    }
}
