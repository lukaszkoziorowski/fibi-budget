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
      saveState(state);
    },
    // Add a new action to clear all data
    clearAllData: (state) => {
      state.categories = [];
      state.transactions = [];
      state.balance = 0;
      state.currentMonth = new Date().toISOString();
      localStorage.removeItem('budgetState');
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
  clearAllData,
} = budgetSlice.actions;

export default budgetSlice.reducer; 