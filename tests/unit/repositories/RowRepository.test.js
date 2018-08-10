import RowRepository from '../../../src/repositories/RowRepository';
import TableConnection from '../../../src/connections/TableConnection';
import Row from '../../../src/models/Row';

jest.mock('../../../src/connections/TableConnection', () => {
    return jest.fn().mockImplementation(() => {
        return {
            resetCalls: () => {},
            callRootRows: () => {
                return {
                    total: 10,
                    rows: [
                        {
                            name: 'Arne',
                        },
                        {
                            name: 'Test',
                        },
                    ],
                };
            },
            callChildRows: (parent) => {
                let row = {
                    name: 'Arne',
                    hasChildren: true,
                    showChildren: true,
                };

                if (parent.name === 'Arne') {
                    row = {name: 'Child Arne'};
                }

                return [
                    row,
                    {
                        name: 'Test',
                    },
                ];
            },
        };
    });
});

describe('Row repository', () => {
    let rowRepository;

    beforeEach(() => {
        rowRepository = new RowRepository(
            new TableConnection()
        );
    });

    it('calls the root rows', async () => {
        let result = await rowRepository.callRootRows();

        expect(result.total).toBe(10);
        expect(result.rows.length).toBe(2);
        expect(result.rows.first.name).toBe('Arne');
    });

    it('calls the child rows and recall to call the children of children', async () => {
        rowRepository.connection = new TableConnection();

        let rows = await rowRepository.callChildRows(new Row());

        expect(rows.length).toBe(2);
        expect(rows.first.name).toBe('Arne');
        expect(rows.first.children.first.name).toBe('Child Arne');
    });
});
