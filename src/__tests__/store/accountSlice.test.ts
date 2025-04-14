import accountReducer, {
  setAccounts,
  addAccount,
  updateAccount,
  deleteAccount,
  setTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from '../../store/accountSlice';
import { Account, Transaction } from '../../types/account';

describe('Account Slice', () => {
  const mockAccount: Account = {
    id: '1',
    name: 'Test Account',
    type: 'checking',
    balance: 1000,
    institutionName: 'Test Bank',
    userId: 'user1',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  const mockTransaction: Transaction = {
    id: '1',
    accountId: '1',
    amount: 100,
    description: 'Test Transaction',
    date: '2024-01-01',
    userId: 'user1',
    isReconciled: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  it('should handle initial state', () => {
    expect(accountReducer(undefined, { type: 'unknown' })).toEqual({
      accounts: [],
      transactions: [],
      isLoading: false,
      error: null,
      activeAccountId: null,
    });
  });

  it('should handle setAccounts', () => {
    const actual = accountReducer(undefined, setAccounts([mockAccount]));
    expect(actual.accounts).toEqual([mockAccount]);
  });

  it('should handle addAccount', () => {
    const actual = accountReducer(undefined, addAccount(mockAccount));
    expect(actual.accounts).toEqual([mockAccount]);
  });

  it('should handle updateAccount', () => {
    const initialState = {
      accounts: [mockAccount],
      transactions: [],
      isLoading: false,
      error: null,
      activeAccountId: null,
    };

    const updatedAccount = { ...mockAccount, name: 'Updated Account' };
    const actual = accountReducer(initialState, updateAccount(updatedAccount));
    expect(actual.accounts[0].name).toBe('Updated Account');
  });

  it('should handle deleteAccount', () => {
    const initialState = {
      accounts: [mockAccount],
      transactions: [],
      isLoading: false,
      error: null,
      activeAccountId: null,
    };

    const actual = accountReducer(initialState, deleteAccount('1'));
    expect(actual.accounts).toHaveLength(0);
  });

  it('should handle setTransactions', () => {
    const actual = accountReducer(undefined, setTransactions([mockTransaction]));
    expect(actual.transactions).toEqual([mockTransaction]);
  });

  it('should handle addTransaction and update account balance', () => {
    const initialState = {
      accounts: [mockAccount],
      transactions: [],
      isLoading: false,
      error: null,
      activeAccountId: null,
    };

    const actual = accountReducer(initialState, addTransaction(mockTransaction));
    expect(actual.transactions).toEqual([mockTransaction]);
    expect(actual.accounts[0].balance).toBe(1100); // 1000 + 100
  });

  it('should handle updateTransaction and update account balance', () => {
    const initialState = {
      accounts: [mockAccount],
      transactions: [mockTransaction],
      isLoading: false,
      error: null,
      activeAccountId: null,
    };

    const updatedTransaction = { ...mockTransaction, amount: 200 };
    const actual = accountReducer(initialState, updateTransaction(updatedTransaction));
    expect(actual.transactions[0].amount).toBe(200);
    expect(actual.accounts[0].balance).toBe(1100); // 1000 - 100 + 200
  });

  it('should handle deleteTransaction and update account balance', () => {
    const initialState = {
      accounts: [mockAccount],
      transactions: [mockTransaction],
      isLoading: false,
      error: null,
      activeAccountId: null,
    };

    const actual = accountReducer(initialState, deleteTransaction('1'));
    expect(actual.transactions).toHaveLength(0);
    expect(actual.accounts[0].balance).toBe(900); // 1000 - 100
  });
}); 
 
 
 
 
 
 