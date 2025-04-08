import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { auth } from '../config/firebase';
import type { CurrencyFormat, BudgetState, Category, Transaction, CategoryGroup } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Load initial state from localStorage if available
const loadState = (): BudgetState => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      return getDefaultState();
    }

    const serializedState = localStorage.getItem(`budgetState_${userId}`);
    if (serializedState === null) {
      // Initialize with empty categories
      const initialState = getDefaultState();
      
      // Save the initial state
      localStorage.setItem(`budgetState_${userId}`, JSON.stringify(initialState));
      return initialState;
    }

    const state = JSON.parse(serializedState);
    
    // Migration: Convert string-based numberFormat to object-based
    if (typeof state.currencyFormat?.numberFormat === 'string') {
      state.currencyFormat.numberFormat = {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      };
      // Save the migrated state
      localStorage.setItem(`budgetState_${userId}`, JSON.stringify(state));
    }
    
    return state;
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return getDefaultState();
  }
};

// Save state to localStorage
const saveState = (state: BudgetState) => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const serializedState = JSON.stringify(state);
    localStorage.setItem(`budgetState_${userId}`, serializedState);
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
};

export const getDefaultState = (): BudgetState => ({
  categories: [
    { id: 'news', name: 'News', budget: 0, groupId: '' },
    { id: 'auto-insurance', name: 'Auto insurance', budget: 0, groupId: '' },
    { id: 'groceries', name: 'Groceries', budget: 0, groupId: '' },
    { id: 'gas', name: 'Gas', budget: 0, groupId: '' },
    { id: 'pet-food', name: 'Pet food', budget: 0, groupId: '' },
    { id: 'pet-boarding', name: 'Pet boarding', budget: 0, groupId: '' },
    { id: 'pet-toys', name: 'Pet toys & treats', budget: 0, groupId: '' },
    { id: 'auto-maintenance', name: 'Auto maintenance', budget: 0, groupId: '' },
    { id: 'bike-maintenance', name: 'Bike maintenance', budget: 0, groupId: '' },
    { id: 'taxes', name: 'Taxes or other fees', budget: 0, groupId: '' },
    { id: 'dining', name: 'Dining out', budget: 0, groupId: '' },
    { id: 'entertainment', name: 'Entertainment', budget: 0, groupId: '' },
    { id: 'baby', name: 'Baby', budget: 0, groupId: '' }
  ],
  categoryGroups: [],
  transactions: [],
  currentMonth: new Date().toISOString(),
  globalCurrency: 'USD',
  currencyFormat: {
    currency: 'USD',
    locale: 'en-US',
    placement: 'before',
    numberFormat: {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    },
    dateFormat: 'MM/DD/YYYY'
  },
  balance: 0,
  budgetName: 'My Budget'
});

const initialState: BudgetState = loadState();

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    loadUserData: (state) => {
      const loadedState = loadState();
      Object.assign(state, loadedState);
    },
    addCategory: (state, action: PayloadAction<{ name: string; budget: number; groupId: string }>) => {
      state.categories.push({
        id: uuidv4(),
        ...action.payload
      });
      saveState(state);
    },
    updateCategory: (state, action: PayloadAction<{ id: string; name?: string; budget?: number }>) => {
      const category = state.categories.find(c => c.id === action.payload.id);
      if (category) {
        if (action.payload.name !== undefined) category.name = action.payload.name;
        if (action.payload.budget !== undefined) category.budget = action.payload.budget;
      }
      saveState(state);
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(c => c.id !== action.payload);
      state.transactions = state.transactions.filter(t => t.categoryId !== action.payload);
      saveState(state);
    },
    addTransaction: (state, action: PayloadAction<Omit<Transaction, 'id'>>) => {
      const transaction = {
        id: uuidv4(),
        ...action.payload
      };
      state.transactions.push(transaction);
      state.balance += transaction.type === 'income' ? transaction.amount : -transaction.amount;
      saveState(state);
    },
    updateTransaction: (state, action: PayloadAction<{ id: string } & Partial<Omit<Transaction, 'id'>>>) => {
      const index = state.transactions.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        const oldTransaction = state.transactions[index];
        state.balance -= oldTransaction.type === 'income' ? oldTransaction.amount : -oldTransaction.amount;
        
        state.transactions[index] = {
          ...oldTransaction,
          ...action.payload
        };
        
        state.balance += state.transactions[index].type === 'income' 
          ? state.transactions[index].amount 
          : -state.transactions[index].amount;
      }
      saveState(state);
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      const transaction = state.transactions.find(t => t.id === action.payload);
      if (transaction) {
        state.balance -= transaction.type === 'income' ? transaction.amount : -transaction.amount;
        state.transactions = state.transactions.filter(t => t.id !== action.payload);
      }
      saveState(state);
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
      state.currencyFormat.currency = action.payload;
      saveState(state);
    },
    setCurrencyFormat: (state, action: PayloadAction<CurrencyFormat>) => {
      state.currencyFormat = action.payload;
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
    reorderCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
      saveState(state);
    },
    resetState: (state) => {
      const defaultState = getDefaultState();
      
      // Reset all state properties
      Object.assign(state, defaultState);
      
      // Don't remove data from localStorage on logout
      // This way the data persists for the next login
      
      // Save new default state
      saveState(defaultState);
    },
    clearUserData: (state) => {
      const defaultState = getDefaultState();
      
      // Reset all state properties
      Object.assign(state, defaultState);
      
      // Clear user data from localStorage
      const userId = auth.currentUser?.uid;
      if (userId) {
        localStorage.removeItem(`budgetState_${userId}`);
      }
      
      // Save new default state
      saveState(defaultState);
    },
    updateCategoryGroup: (state, action: PayloadAction<{ id: string; name: string }>) => {
      const group = state.categoryGroups.find(g => g.id === action.payload.id);
      if (group) {
        group.name = action.payload.name;
      }
      saveState(state);
    },
    addCategoryGroup: (state, action: PayloadAction<{ name: string }>) => {
      state.categoryGroups.push({
        id: uuidv4(),
        name: action.payload.name,
        isCollapsed: false
      });
      saveState(state);
    },
    deleteCategoryGroup: (state, action: PayloadAction<string>) => {
      state.categoryGroups = state.categoryGroups.filter(g => g.id !== action.payload);
      state.categories = state.categories.filter(c => c.groupId !== action.payload);
      saveState(state);
    },
    toggleGroupCollapse: (state, action: PayloadAction<string>) => {
      const group = state.categoryGroups.find(g => g.id === action.payload);
      if (group) {
        group.isCollapsed = !group.isCollapsed;
      }
      saveState(state);
    },
    moveCategoryToGroup: (state, action: PayloadAction<{ categoryId: string; groupId: string }>) => {
      const category = state.categories.find(c => c.id === action.payload.categoryId);
      if (category) {
        category.groupId = action.payload.groupId;
      }
      saveState(state);
    },
    setBudgetName: (state, action: PayloadAction<string>) => {
      state.budgetName = action.payload;
      saveState(state);
    },
    randomizeCategories: (state) => {
      const groupIds = state.categoryGroups.map(group => group.id);
      state.categories = state.categories.map(category => ({
        ...category,
        groupId: groupIds[Math.floor(Math.random() * groupIds.length)]
      }));
      saveState(state);
    }
  },
});

export const {
  loadUserData,
  addCategory,
  updateCategory,
  deleteCategory,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  setCurrentMonth,
  setGlobalCurrency,
  setCurrencyFormat,
  clearAllData,
  reorderCategories,
  resetState,
  clearUserData,
  updateCategoryGroup,
  addCategoryGroup,
  deleteCategoryGroup,
  toggleGroupCollapse,
  moveCategoryToGroup,
  setBudgetName,
  randomizeCategories
} = budgetSlice.actions;

export default budgetSlice.reducer; 