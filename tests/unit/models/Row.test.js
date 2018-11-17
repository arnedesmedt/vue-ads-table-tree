import Row from '../../../src/models/Row';
import RowCollection from '../../../src/collections/RowCollection';

describe('Row model', () => {
    it('initializes the default values if no arguments are given', () => {
        const row = new Row();

        expect(row.children.empty()).toBeTruthy();
        expect(row.visibleChildren.empty()).toBeTruthy();
        expect(row.showChildren).toBeFalsy();
        expect(row.hasChildren).toBeFalsy();
        expect(row.childrenLoaded()).toBeFalsy();
    });

    it('initializes the given values from the argument', () => {
        const row = new Row({
            name: 'arne',
            showChildren: true,
            hasChildren: true,
            children: new RowCollection([{name: 'de smedt'}]),
        });

        row.children.loading = true;

        expect(row.children.empty()).toBeFalsy();
        expect(row.showChildren).toBeTruthy();
        expect(row.hasChildren).toBeTruthy();
        expect(row.children.loading).toBeTruthy();
        expect(row.name).toBe('arne');
        expect(row.children.first.name).toBe('de smedt');
    });

    it('sets hasChildren on true if children is not empty', () => {
        const row = new Row({
            hasChildren: false,
            children: new RowCollection([{name: 'de smedt'}]),
        });

        expect(row.children.empty()).toBeFalsy();
        expect(row.hasChildren).toBeTruthy();
    });

    it('adds a parent to all children', () => {
        const row = new Row({
            name: 'arne',
            children: new RowCollection([{name: 'de smedt'}]),
        });

        expect(row.children.first.parent.name).toBe('arne');
    });

    it('creates a RowCollection if the children attribute is an array', () => {
        const row = new Row({
            children: [
                {
                    name: 'de smedt',
                },
            ],
        });

        expect(row.children).toBeInstanceOf(RowCollection);
    });

    it('returns the properties if asked for', () => {
        const row = new Row({
            showChildren: false,
            firstName: 'arne',
            lastName: 'de smedt',
        });

        expect(row.properties).toEqual([
            'firstName',
            'lastName',
        ]);
    });

    it('shows/hide the children on a toggleChildren call', () => {
        const row = new Row({
            showChildren: false,
        });

        row.toggleChildren();
        expect(row.showChildren).toBeTruthy();
        row.toggleChildren();
        expect(row.showChildren).toBeFalsy();
    });

    it('checks if the children are loaded', () => {
        const row = new Row({
            hasChildren: true,
            children: new RowCollection([{name: 'de smedt'}]),
        });

        expect(row.childrenLoaded()).toBeTruthy();
        row.children = new RowCollection();
        expect(row.childrenLoaded()).toBeFalsy();
    });

    it('counts the parents', () => {
        const row = new Row({
            children: new RowCollection([
                {
                    children: new RowCollection([
                        {
                            name: 'arne',
                        },
                    ]),
                },
            ]),
        });

        expect(row.children.first.children.first.countParents()).toBe(2);
    });

    it('returns the processed children otherwise the default children', () => {
        const row = new Row({
            children: new RowCollection([{name: 'arne'}]),
        });

        expect(row.visibleChildren.first.name).toBe('arne');
        row.visibleChildren = new RowCollection();
        expect(row.visibleChildren.empty()).toBeTruthy();
    });

    it('throws an error if the parent of a row is not a row', () => {
        const row = new Row();

        expect(() => {
            row.parent = 1;
        }).toThrow('Parent of a row has to be a row');
    });

    it('sets loadChildren on true, if the row has to show the children, it has children and the children are empty', () => {
        const row = new Row({
            showChildren: true,
            hasChildren: true,
        });

        expect(row.loadChildren()).toBeTruthy();
    });
});
