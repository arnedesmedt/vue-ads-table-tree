import RowCollection from '../collections/RowCollection';

export default class Row {
    constructor (properties) {
        this.children = new RowCollection();
        this.processedChildren = null;
        this.showChildren = false;
        this.hasChildren = false;
        this.childrenLoading = false;
        Object.assign(this, properties);
    }

    set parent (parent) {
        if (!(parent instanceof Row)) {
            throw new Error(
                'Parent of a row has to be a row'
            );
        }

        this._parent = parent;
    }

    get parent () {
        return this._parent;
    }

    set children (children) {
        this._children = children instanceof RowCollection ? children : new RowCollection(children);
        this._children.items
            .forEach(childRow => {
                childRow.parent = this;
            });

        this.hasChildren = !this._children.isEmpty();
    }

    get children () {
        return this._children;
    }

    set childrenLoading (childrenLoading) {
        this._childrenLoading = childrenLoading;
    }

    get childrenLoading () {
        return this._childrenLoading;
    }

    set processedChildren (processedChildren) {
        this._processedChildren = processedChildren;

        // wss voor async calls.
        // this._processedChildren.items
        //     .forEach(filteredChild => {
        //         filteredChild.parent = this;
        //     });
    }

    get processedChildren () {
        return this._processedChildren === null ? this.children : this._processedChildren;
    }

    set hasChildren (hasChildren) {
        this._hasChildren = hasChildren;
    }

    get hasChildren () {
        return this._hasChildren;
    }

    set showChildren (showChildren) {
        this._showChildren = showChildren;
    }

    get showChildren () {
        return this._showChildren;
    }

    get properties () {
        return Object.getOwnPropertyNames(this)
            .filter(property => {
                return property[0] !== '_';
            });
    }

    toggleChildren () {
        this.showChildren = !this.showChildren;
    }

    childrenLoaded () {
        return this.hasChildren && !this.children.isEmpty();
    }

    loadChildren () {
        return this.showChildren && this.hasChildren && this.children.isEmpty();
    }

    countParents () {
        if (this.parent) {
            return this.parent.countParents() + 1;
        }

        return 0;
    }
}
