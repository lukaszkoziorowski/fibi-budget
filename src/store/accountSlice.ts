import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Account, Transaction, AccountState } from '../types/account';

const initialState: AccountState = {
  accounts: [],
  transactions: [],
  isLoading: false,
  error: null,
  activeAccountId: null
};

const accountSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setAccounts: (state, action: PayloadAction<Account[]>) => {
      state.accounts = action.payload;
    },
    addAccount: (state, action: PayloadAction<Account>) => {
      state.accounts.push(action.payload);
    },
    updateAccount: (state, action: PayloadAction<Account>) => {
      const index = state.accounts.findIndex(acc => acc.id === action.payload.id);
      if (index !== -1) {
        state.accounts[index] = action.payload;
      }
    },
    deleteAccount: (state, action: PayloadAction<string>) => {
      state.accounts = state.accounts.filter(acc => acc.id !== action.payload);
      state.transactions = state.transactions.filter(t => t.accountId !== action.payload);
    },
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.push(action.payload);
      const account = state.accounts.find(acc => acc.id === action.payload.accountId);
      if (account) {
        account.balance += action.payload.amount;
      }
    },
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const index = state.transactions.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        const oldTransaction = state.transactions[index];
        const account = state.accounts.find(acc => acc.id === action.payload.accountId);
        if (account) {
          account.balance -= oldTransaction.amount;
          account.balance += action.payload.amount;
        }
        state.transactions[index] = action.payload;
      }
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      const transaction = state.transactions.find(t => t.id === action.payload);
      if (transaction) {
        const account = state.accounts.find(acc => acc.id === transaction.accountId);
        if (account) {
          account.balance -= transaction.amount;
        }
        state.transactions = state.transactions.filter(t => t.id !== action.payload);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setAccounts,
  addAccount,
  updateAccount,
  deleteAccount,
  setTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  setLoading,
  setError,
} = accountSlice.actions;

export default accountSlice.reducer; 
 
 
 
 
 
 