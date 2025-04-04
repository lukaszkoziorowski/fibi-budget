import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'cash';
  balance: number;
  currency: string;
  color: string;
  isHidden: boolean;
}

interface AccountsState {
  accounts: Account[];
  activeAccountId: string | null;
}

const initialState: AccountsState = {
  accounts: [],
  activeAccountId: null,
};

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    addAccount: (state, action: PayloadAction<Omit<Account, 'id'>>) => {
      const newAccount = {
        ...action.payload,
        id: crypto.randomUUID(),
      };
      state.accounts.push(newAccount);
      if (!state.activeAccountId) {
        state.activeAccountId = newAccount.id;
      }
    },
    setActiveAccount: (state, action: PayloadAction<string>) => {
      state.activeAccountId = action.payload;
    },
    updateAccount: (state, action: PayloadAction<Account>) => {
      const index = state.accounts.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.accounts[index] = action.payload;
      }
    },
    deleteAccount: (state, action: PayloadAction<string>) => {
      state.accounts = state.accounts.filter(a => a.id !== action.payload);
      if (state.activeAccountId === action.payload) {
        state.activeAccountId = state.accounts[0]?.id || null;
      }
    },
  },
});

export const { addAccount, setActiveAccount, updateAccount, deleteAccount } = accountsSlice.actions;
export default accountsSlice.reducer; 