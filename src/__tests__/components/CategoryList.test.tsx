import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { AnyAction, configureStore } from '@reduxjs/toolkit';
import CategoryList from '@/components/CategoryList/index';
import { Category, CurrencyFormat } from '@/types';
import { describe, it, expect, beforeEach } from 'vitest';

// Mock the hooks
jest.mock('@/hooks/useCurrency', () => ({
  useCurrency: () => ({
    currencyFormat: {
      currency: 'USD',
      placement: 'before',
      numberFormat: '123,456.78'
    },
    currencySymbol: '$'
  })
}));

jest.mock('@/hooks/useExchangeRates', () => ({
  useExchangeRates: () => ({
    convertAmount: (amount: number) => amount
  })
}));

jest.mock('@/hooks/useBudgetStats', () => ({
  useBudgetStats: () => {}
}));

interface BudgetState {
  categories: Category[];
  transactions: any[];
  currentMonth: string;
  globalCurrency: string;
  currencyFormat: CurrencyFormat;
  balance: number;
  budgetName: string;
}

const initialState: BudgetState = {
  categories: [
    { id: '1', name: 'Food', budget: 1000 },
    { id: '2', name: 'Transport', budget: 500 }
  ],
  transactions: [
    { id: '1', amount: 500, categoryId: '1', date: new Date().toISOString() },
    { id: '2', amount: 200, categoryId: '2', date: new Date().toISOString() },
    { 
      id: '1', 
      amount: -100, 
      categoryId: '1', 
      date: '2024-03-15', 
      description: 'Groceries',
      type: 'expense',
      currency: 'USD'
    }
  ],
  currentMonth: '2024-03',
  globalCurrency: 'USD',
  currencyFormat: {
    currency: 'USD',
    placement: 'before',
    numberFormat: {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    },
    dateFormat: 'MM/DD/YYYY'
  },
  balance: 1000,
  budgetName: 'My Budget'
};

describe('CategoryList', () => {
  const mockStore = configureStore({
    reducer: {
      budget: (state: BudgetState = initialState, action: any) => {
        switch (action.type) {
          case 'budget/setCurrencyFormat':
            return {
              ...state,
              currencyFormat: action.payload
            };
          default:
            return state;
        }
      }
    }
  });

  beforeEach(() => {
    mockStore.dispatch({ type: 'budget/setCurrencyFormat', payload: initialState.currencyFormat });
    jest.clearAllMocks();
  });

  it('renders all categories', () => {
    render(
      <Provider store={mockStore}>
        <CategoryList />
      </Provider>
    );
    
    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText('Transport')).toBeInTheDocument();
  });

  it('displays correct budget and activity amounts', () => {
    render(
      <Provider store={mockStore}>
        <CategoryList />
      </Provider>
    );
    
    // Food category
    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
    expect(screen.getByText('$500.00')).toBeInTheDocument();
    expect(screen.getByText('$500.00')).toBeInTheDocument();

    // Transport category
    expect(screen.getByText('$500.00')).toBeInTheDocument();
    expect(screen.getByText('$200.00')).toBeInTheDocument();
    expect(screen.getByText('$300.00')).toBeInTheDocument();
  });

  it('handles category updates', () => {
    const store = configureStore({
      reducer: {
        budget: (state: BudgetState = initialState, action: AnyAction): BudgetState => {
          if (action.type === 'budget/updateCategory') {
            return {
              ...state,
              categories: state.categories.map((cat: Category) =>
                cat.id === action.payload.id ? action.payload : cat
              )
            };
          }
          return state;
        }
      }
    });

    render(
      <Provider store={store}>
        <CategoryList />
      </Provider>
    );
    
    // Click edit button on first category
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);

    // Update name and budget
    const nameInput = screen.getByDisplayValue('Food');
    const budgetInput = screen.getByDisplayValue('1000');
    
    fireEvent.change(nameInput, { target: { value: 'Groceries' } });
    fireEvent.change(budgetInput, { target: { value: '1200' } });

    // Save changes
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    const updatedCategory = store.getState().budget.categories.find((c: Category) => c.id === '1');
    expect(updatedCategory?.name).toBe('Groceries');
    expect(updatedCategory?.budget).toBe(1200);
  });

  it('handles category deletion', () => {
    const store = configureStore({
      reducer: {
        budget: (state: BudgetState = initialState, action: AnyAction): BudgetState => {
          if (action.type === 'budget/deleteCategory') {
            return {
              ...state,
              categories: state.categories.filter((cat: Category) => cat.id !== action.payload)
            };
          }
          return state;
        }
      }
    });

    render(
      <Provider store={store}>
        <CategoryList />
      </Provider>
    );
    
    // Click delete button on second category
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[1]);

    const remainingCategories = store.getState().budget.categories;
    expect(remainingCategories).toHaveLength(1);
    expect(remainingCategories[0].id).toBe('1');
  });

  it('handles category reordering', () => {
    const store = configureStore({
      reducer: {
        budget: (state: BudgetState = initialState, action: AnyAction): BudgetState => {
          if (action.type === 'budget/reorderCategories') {
            return {
              ...state,
              categories: action.payload
            };
          }
          return state;
        }
      }
    });

    render(
      <Provider store={store}>
        <CategoryList />
      </Provider>
    );
    
    const categoryRows = screen.getAllByRole('row').slice(1); // Skip header row
    
    // Simulate drag and drop
    fireEvent.dragStart(categoryRows[0]);
    fireEvent.dragOver(categoryRows[1]);
    fireEvent.drop(categoryRows[1]);

    const reorderedCategories = store.getState().budget.categories;
    expect(reorderedCategories[0].id).toBe('2');
    expect(reorderedCategories[1].id).toBe('1');
  });

  it('renders category amounts with correct currency format', () => {
    render(
      <Provider store={mockStore}>
        <CategoryList />
      </Provider>
    );

    // Check if amounts are formatted correctly with USD
    expect(screen.getByText('$1,000.00')).toBeInTheDocument(); // Budget amount
    expect(screen.getByText('$100.00')).toBeInTheDocument(); // Activity amount
    expect(screen.getByText('$900.00')).toBeInTheDocument(); // Remaining amount
  });

  it('updates amounts when currency format changes', () => {
    render(
      <Provider store={mockStore}>
        <CategoryList />
      </Provider>
    );

    // Change currency format to EUR with different decimal places
    mockStore.dispatch({
      type: 'budget/setCurrencyFormat',
      payload: {
        currency: 'EUR',
        placement: 'after',
        numberFormat: {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        },
        dateFormat: 'DD/MM/YYYY'
      }
    });

    // Check if amounts are formatted correctly with EUR
    expect(screen.getByText('1,000€')).toBeInTheDocument(); // Budget amount
    expect(screen.getByText('100€')).toBeInTheDocument(); // Activity amount
    expect(screen.getByText('900€')).toBeInTheDocument(); // Remaining amount
  });
}); 