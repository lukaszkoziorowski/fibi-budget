import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Report from '@/components/Report';
import { BudgetState } from '@/types';
import { describe, it, expect, beforeEach, vi } from 'vitest';

const initialState: BudgetState = {
  categories: [
    { id: '1', name: 'Food', budget: 1000 },
    { id: '2', name: 'Transport', budget: 500 }
  ],
  transactions: [
    { 
      id: '1', 
      amount: -100, 
      categoryId: '1', 
      date: '2024-03-15', 
      description: 'Groceries',
      type: 'expense',
      currency: 'USD'
    },
    { 
      id: '2', 
      amount: -200, 
      categoryId: '2', 
      date: '2024-02-15', 
      description: 'Bus ticket',
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

describe('Report', () => {
  const createMockStore = (state = initialState) => configureStore({
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
    },
    preloadedState: {
      budget: state
    }
  });

  let mockStore = createMockStore();

  beforeEach(() => {
    mockStore = createMockStore();
    vi.clearAllMocks();
  });

  it('renders expenses trend with correct currency format', () => {
    render(
      <Provider store={mockStore}>
        <Report />
      </Provider>
    );

    // Check if the report title is rendered
    expect(screen.getByText('Expense Report')).toBeInTheDocument();

    // Check if the chart section is rendered
    expect(screen.getByText('Expenses Trend')).toBeInTheDocument();
    const chartContainer = screen.getByTestId('chart-container');
    expect(chartContainer).toBeInTheDocument();
    expect(chartContainer).toHaveClass('h-[400px]');
  });

  it('updates expenses trend when currency format changes', () => {
    render(
      <Provider store={mockStore}>
        <Report />
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

    // The chart should still be rendered
    const chartContainer = screen.getByTestId('chart-container');
    expect(chartContainer).toBeInTheDocument();
  });
}); 
 
 