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
}

interface BudgetState {
  categories: Category[];
  transactions: Transaction[];
  balance: number;
  currentMonth: string;
}

// Load initial state from localStorage if available
const loadState = (): BudgetState => {
  try {
    const serializedState = localStorage.getItem('budgetState');
    if (serializedState === null) {
      return {
        categories: [],
        transactions: [],
        balance: 0,
        currentMonth: new Date().toISOString(),
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return {
      categories: [],
      transactions: [],
      balance: 0,
      currentMonth: new Date().toISOString(),
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
      state.balance += action.payload.amount;
      saveState(state);
    },
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const index = state.transactions.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.balance -= state.transactions[index].amount;
        
        const newAmount = action.payload.type === 'expense' 
          ? -Math.abs(Number(action.payload.amount))
          : Math.abs(Number(action.payload.amount));
        
        state.balance += newAmount;
        state.transactions[index] = {
          ...action.payload,
          amount: newAmount
        };
        saveState(state);
      }
    },
    setCurrentMonth: (state, action: PayloadAction<string>) => {
      state.currentMonth = action.payload;
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
  clearAllData,
} = budgetSlice.actions;

export default budgetSlice.reducer; 