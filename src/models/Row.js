import RowCollection from '../collections/RowCollection';

export default class Row {
    constructor (properties = {}) {

        this.loading = false;
        this.showChildren = properties.showChildren || false;
        this.children = properties.children || [];
        this.hasChildren = properties.hasChildren || this.hasChildren;
        this.classes = properties.classes;

        this.properties = properties;
    }

    set classes (classes) {
        this._classes = classes;
    }

    get classes () {
        return this._classes;
    }

    set loading (loading) {
        this._loading = loading;
    }

    get loading () {
        return this._loading;
    }

    set parent (parent) {
        this._parent = parent instanceof Row ? parent : undefined;
    }

    get parent () {
        return this._parent;
    }

    set children (children) {
        this._children = children instanceof RowCollection ? children : new RowCollection(children);
        this._children.initParent(this);

        this.hasChildren = !this._children.empty();
    }

    get children () {
        return this._children;
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

    set visibleChildren (visibleChildren) {
        this._visibleChildren = visibleChildren;
        this._visibleChildren.initParent(this);
    }

    get visibleChildren () {
        if (!this.showChildren) {
            return new RowCollection();
        }

        return this._visibleChildren ? this._visibleChildren : this.children;
    }

    set properties (properties) {
        this._properties = properties;
    }

    get properties () {
        return this._properties;
    }

    get propertyNames () {
        return Object
            .getOwnPropertyNames(this.properties)
            .filter(property => ![
                'showChildren',
                'classes',
                'children',
                'hasChildren',
            ].includes(property));
    }

    toggleChildren () {
        this.showChildren = !this.showChildren;
    }

    toggleLoading () {
        this.loading = !this.loading;
    }

    childrenLoaded () {
        return this.hasChildren && !this.children.empty();
    }

    loadChildren () {
        return this.showChildren && this.hasChildren && this.children.empty();
    }

    countParents () {
        if (this.parent) {
            return this.parent.countParents() + 1;
        }

        return 0;
    }
}
