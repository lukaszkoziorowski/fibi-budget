import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'cash';
  balance: number;
  currency: string;
  color: string;
  isHidden: boolean;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  currency: string;
  date: string;
  description: string;
  type: 'debit' | 'credit';
  isReconciled: boolean;
  categoryId: string | null;
  memo: string | null;
}

interface AccountsState {
  accounts: Account[];
  activeAccountId: string | null;
  transactions: Transaction[];
}

// Load state from localStorage
const loadState = (): AccountsState => {
  try {
    const savedState = localStorage.getItem('fibi-accounts');
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (e) {
    console.error('Error loading accounts state from localStorage:', e);
  }

  // Return default state if nothing found in localStorage
  return {
    accounts: [
      {
        id: uuidv4(),
        name: 'My Checking Account',
        type: 'checking',
        balance: 1000,
        currency: 'USD',
        color: '#9333ea', // Purple
        isHidden: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(), // Added missing required field
      }
    ],
    activeAccountId: null,
    transactions: [],
  };
};

// Save state to localStorage
const saveState = (state: AccountsState) => {
  try {
    localStorage.setItem('fibi-accounts', JSON.stringify(state));
  } catch (e) {
    console.error('Error saving accounts state to localStorage:', e);
  }
};

const initialState: AccountsState = loadState();

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    addAccount: (state, action: PayloadAction<Omit<Account, 'id' | 'createdAt'>>) => {
      const newAccount: Account = {
        ...action.payload,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      };
      state.accounts.push(newAccount);
      if (!state.activeAccountId) {
        state.activeAccountId = newAccount.id;
      }
      saveState(state);
    },
    updateAccount: (state, action: PayloadAction<Partial<Account> & { id: string }>) => {
      const index = state.accounts.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.accounts[index] = { ...state.accounts[index], ...action.payload };
        saveState(state);
      }
    },
    deleteAccount: (state, action: PayloadAction<string>) => {
      state.accounts = state.accounts.filter(a => a.id !== action.payload);
      if (state.activeAccountId === action.payload) {
        state.activeAccountId = state.accounts[0]?.id || null;
      }
      saveState(state);
    },
    setActiveAccount: (state, action: PayloadAction<string | null>) => {
      state.activeAccountId = action.payload;
      saveState(state);
    },
  },
});

export const { 
  addAccount, 
  updateAccount, 
  deleteAccount, 
  setActiveAccount 
} = accountsSlice.actions;

export default accountsSlice.reducer; 