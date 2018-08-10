import Filter from '../../../src/services/Filter';
import Sort from '../../../src/services/Sort';
import Paginate from '../../../src/services/Paginate';
import TableConnection from '../../../src/connections/TableConnection';

jest.mock('../../../src/services/Filter');
jest.mock('../../../src/services/Sort');
jest.mock('../../../src/services/Paginate');

describe('Table connection', () => {
    let connection;

    beforeEach(() => {
        connection = new TableConnection(
            (range, filter, sortColumns, parent) => {
                if (parent) {
                    return {
                        rows: 'parent',
                    };
                }

                return 'nothing';
            },
            new Filter(),
            new Sort(),
            new Paginate(),
        );
    });

    it('initiates with the default values', () => {
        expect(connection.loading).toBeFalsy();
        expect(connection.consecutiveCalls).toBe(0);
    });

    it('throws an error if the callable is not callable', () => {
        expect(() => {
            connection.callable = 1;
        }).toThrow('Callable to get async rows has to be a function. \'number\' given.')
    });

    it('return the root rows on a call', () => {
        expect(connection.callRootRows()).resolves.toBe('nothing');
    });

    it('return the child rows on a call', () => {
        expect(connection.callChildRows(1)).resolves.toBe('parent');
    });

    it('calls too many times without a reset it throws an exception', async () => {
        for (let i = 0; i < 10; i++) {
            await connection.callRootRows();
        }

        try {
            await connection.callRootRows();
        } catch (e) {
            expect(e).toEqual(new Error('Too much async calls. Prevent loading the children by setting showChildren to false.'));
        }
    });

    it('reset the calls', async () => {
        for (let i = 0; i < 9; i++) {
            await connection.callRootRows();
        }

        expect(connection.consecutiveCalls).toBe(9);
        connection.resetCalls();
        expect(connection.consecutiveCalls).toBe(0);
    });
});
