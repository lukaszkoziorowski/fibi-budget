import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Category {
  id: string;
  name: string;
  budget: number;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  categoryId: string;
  type: 'income' | 'expense';
  date: string;
  currency: string;
  originalAmount?: number;
  originalCurrency?: string;
}

interface BudgetState {
  categories: Category[];
  transactions: Transaction[];
  balance: number;
  currentMonth: string;
  globalCurrency: string;
  budgetName: string;
  currencyFormat: {
    currency: string;
    placement: 'before' | 'after';
    numberFormat: string;
    dateFormat: string;
  };
}

// Load initial state from localStorage if available
const loadState = (): BudgetState => {
  try {
    const serializedState = localStorage.getItem('budgetState');
    if (serializedState === null) {
      // Initialize with empty categories
      const initialState = {
        categories: [],
        transactions: [],
        balance: 0,
        currentMonth: new Date().toISOString(),
        globalCurrency: 'USD',
        budgetName: 'My Budget',
        currencyFormat: {
          currency: 'USD',
          placement: 'before' as const,
          numberFormat: '123,456.78',
          dateFormat: 'MM/DD/YYYY',
        },
      };
      
      // Save the initial state
      localStorage.setItem('budgetState', JSON.stringify(initialState));
      return initialState;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return {
      categories: [],
      transactions: [],
      balance: 0,
      currentMonth: new Date().toISOString(),
      globalCurrency: 'USD',
      budgetName: 'My Budget',
      currencyFormat: {
        currency: 'USD',
        placement: 'before' as const,
        numberFormat: '123,456.78',
        dateFormat: 'MM/DD/YYYY',
      },
    };
  }
};

// Save state to localStorage
const saveState = (state: BudgetState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('budgetState', serializedState);
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
};

const initialState: BudgetState = loadState();

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload);
      saveState(state);
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.categories.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
        saveState(state);
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(c => c.id !== action.payload);
      state.transactions = state.transactions.filter(t => t.categoryId !== action.payload);
      saveState(state);
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.push(action.payload);
      if (action.payload.currency === state.globalCurrency) {
        state.balance += action.payload.amount;
      } else {
        // If transaction is in a different currency, use the converted amount
        state.balance += action.payload.amount;
        // Original amount and currency are stored for reference
      }
      saveState(state);
    },
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const index = state.transactions.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        // Remove old transaction's impact on balance
        if (state.transactions[index].currency === state.globalCurrency) {
          state.balance -= state.transactions[index].amount;
        }
        
        // Add new transaction's impact on balance
        if (action.payload.currency === state.globalCurrency) {
          state.balance += action.payload.amount;
        }
        
        state.transactions[index] = action.payload;
        saveState(state);
      }
    },
    setCurrentMonth: (state, action: PayloadAction<string>) => {
      const previousMonth = state.currentMonth;
      state.currentMonth = action.payload;

      // If moving to a different month, only preserve categories and their budgets
      if (new Date(previousMonth).getMonth() !== new Date(action.payload).getMonth()) {
        // Keep existing categories with their budgets
        const existingCategories = state.categories.map(category => ({
          ...category
        }));

        // Keep categories with their budgets, but preserve all transactions
        state.categories = existingCategories;
      }
      
      saveState(state);
    },
    setGlobalCurrency: (state, action: PayloadAction<string>) => {
      state.globalCurrency = action.payload;
      // Also update the currency in currencyFormat to keep them in sync
      state.currencyFormat.currency = action.payload;
      saveState(state);
    },
    setBudgetName: (state, action: PayloadAction<string>) => {
      state.budgetName = action.payload;
      saveState(state);
    },
    setCurrencyFormat: (state, action: PayloadAction<BudgetState['currencyFormat']>) => {
      state.currencyFormat = action.payload;
      // Keep global currency in sync with currency format
      state.globalCurrency = action.payload.currency;
      saveState(state);
    },
    // Add a new action to clear all data
    clearAllData: (state) => {
      const currentCurrency = state.globalCurrency; // Preserve current currency
      state.categories = [];
      state.transactions = [];
      state.balance = 0;
      state.currentMonth = new Date().toISOString();
      state.globalCurrency = currentCurrency; // Keep the same currency
      saveState(state); // Save the state with preserved currency
    },
    resetState: (state) => {
      const defaultState = {
        categories: [],
        transactions: [],
        balance: 0,
        currentMonth: new Date().toISOString(),
        globalCurrency: 'USD',
        budgetName: 'My Budget',
        currencyFormat: {
          currency: 'USD',
          placement: 'before' as const,
          numberFormat: '123,456.78',
          dateFormat: 'MM/DD/YYYY',
        },
      };
      
      // Reset all state properties
      Object.assign(state, defaultState);
      
      // Clear localStorage
      localStorage.removeItem('budgetState');
      
      // Save new default state
      saveState(defaultState);
    },
  },
});

export const {
  addCategory,
  updateCategory,
  deleteCategory,
  addTransaction,
  updateTransaction,
  setCurrentMonth,
  setGlobalCurrency,
  setBudgetName,
  setCurrencyFormat,
  clearAllData,
  resetState,
} = budgetSlice.actions;

export default budgetSlice.reducer; 