import Row from '../../../src/models/Row';
import RowCollection from '../../../src/collections/RowCollection';

describe('Row model', () => {
    it('initializes the default values if no arguments are given', function () {
        const row = new Row();

        expect(row.children.isEmpty()).toBeTruthy();
        expect(row.processedChildren.isEmpty()).toBeTruthy();
        expect(row.showChildren).toBeFalsy();
        expect(row.hasChildren).toBeFalsy();
    });

    it('initializes the given values from the argument', function () {
        const row = new Row({
            name: 'arne',
            showChildren: true,
            hasChildren: true,
            children: new RowCollection([{name: 'de smedt'}]),
        });

        expect(row.children.isEmpty()).toBeFalsy();
        expect(row.showChildren).toBeTruthy();
        expect(row.hasChildren).toBeTruthy();
        expect(row.name).toBe('arne');
        expect(row.children.items[0].name).toBe('de smedt');
    });

    it('sets hasChildren on true if children is not empty', function () {
        const row = new Row({
            hasChildren: false,
            children: new RowCollection([{name: 'de smedt'}]),
        });

        expect(row.children.isEmpty()).toBeFalsy();
        expect(row.hasChildren).toBeTruthy();
    });

    it('adds a parent to all children', function () {
        const row = new Row({
            name: 'arne',
            children: new RowCollection([{name: 'de smedt'}]),
        });

        expect(row.children.items[0].parent.name).toBe('arne');
    });

    it('creates a RowCollection if the children attribute is an array', function () {
        const row = new Row({
            children: [
                {
                    name: 'de smedt',
                },
            ],
        });

        expect(row.children).toBeInstanceOf(RowCollection);
    });

    it('returns the properties if asked for', function () {
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

    it('shows/hide the children on a toggleChildren call', function () {
        const row = new Row({
            showChildren: false,
        });

        row.toggleChildren();
        expect(row.showChildren).toBeTruthy();
        row.toggleChildren();
        expect(row.showChildren).toBeFalsy();
    });

    it('checks if the children are loaded', function () {
        const row = new Row({
            hasChildren: true,
            children: new RowCollection([{name: 'de smedt'}]),
        });

        expect(row.childrenLoaded()).toBeTruthy();
        row.children = new RowCollection();
        expect(row.childrenLoaded()).toBeFalsy();
    });

    it('counts the parents', function () {
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

        expect(row.children.items[0].children.items[0].countParents()).toBe(2);
    });

    it('gives the processed children otherwise the default children', function () {
        const row = new Row({
            children: new RowCollection([{name: 'arne'}]),
        });

        expect(row.processedChildren.items[0].name).toBe('arne');
        row.processedChildren = new RowCollection();
        expect(row.processedChildren.isEmpty()).toBeTruthy();
    });

    it('throws an error if the parent of a row is not a row', function () {
        const row = new Row();

        expect(() => {
            row.parent = 1;
        }).toThrow('Parent of a row has to be a row');
    });
});
