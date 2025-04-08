import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, AnyAction } from '@reduxjs/toolkit';
import BudgetSettings from '@/components/BudgetSettings';
import { BudgetState } from '@/types';
import { describe, it, expect, beforeEach, vi } from 'vitest';

const initialState: BudgetState = {
  categories: [],
  transactions: [],
  currentMonth: '2024-03',
  globalCurrency: 'USD',
  currencyFormat: {
      currency: 'USD',
      placement: 'before',
      numberFormat: {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
      },
      dateFormat: ''
  },
  balance: 1000,
  budgetName: 'My Budget'
};

describe('BudgetSettings', () => {
  const mockStore = configureStore({
    reducer: {
      budget: (state: BudgetState = initialState, action: AnyAction): BudgetState => {
        switch (action.type) {
          case 'budget/setGlobalCurrency':
            return {
              ...state,
              globalCurrency: action.payload,
              currencyFormat: {
                ...state.currencyFormat,
                currency: action.payload
              }
            };
          case 'budget/setCurrencyFormat':
            return {
              ...state,
              currencyFormat: action.payload
            };
          case 'budget/setBudgetName':
            return {
              ...state,
              budgetName: action.payload
            };
          default:
            return state;
        }
      }
    }
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the budget settings form', () => {
    render(
      <Provider store={mockStore}>
        <BudgetSettings />
      </Provider>
    );

    expect(screen.getByText('Budget Name')).toBeInTheDocument();
    expect(screen.getByText('Currency')).toBeInTheDocument();
    expect(screen.getByText('Currency Placement')).toBeInTheDocument();
    expect(screen.getByText('Number Format')).toBeInTheDocument();
    expect(screen.getByText('Date Format')).toBeInTheDocument();
  });

  it('allows changing currency', () => {
    render(
      <Provider store={mockStore}>
        <BudgetSettings />
      </Provider>
    );

    const editButton = screen.getByText('Edit', { selector: 'button' });
    fireEvent.click(editButton);

    const currencySelect = screen.getByLabelText('Currency');
    fireEvent.change(currencySelect, { target: { value: 'EUR' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(mockStore.getState().budget.globalCurrency).toBe('EUR');
    expect(mockStore.getState().budget.currencyFormat.currency).toBe('EUR');
  });

  it('allows changing currency placement', () => {
    render(
      <Provider store={mockStore}>
        <BudgetSettings />
      </Provider>
    );

    const editButtons = screen.getAllByText('Edit', { selector: 'button' });
    fireEvent.click(editButtons[1]); // Click the second Edit button (Currency Placement)

    const placementSelect = screen.getByLabelText('Currency Placement');
    fireEvent.change(placementSelect, { target: { value: 'after' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(mockStore.getState().budget.currencyFormat.placement).toBe('after');
  });

  it('allows changing number format', () => {
    render(
      <Provider store={mockStore}>
        <BudgetSettings />
      </Provider>
    );

    const editButtons = screen.getAllByText('Edit', { selector: 'button' });
    fireEvent.click(editButtons[2]); // Click the third Edit button (Number Format)

    const numberFormatSelect = screen.getByLabelText('Number Format');
    fireEvent.change(numberFormatSelect, { target: { value: '123.456,78' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(mockStore.getState().budget.currencyFormat.numberFormat).toEqual({
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  });

  it('allows changing date format', () => {
    render(
      <Provider store={mockStore}>
        <BudgetSettings />
      </Provider>
    );

    const editButtons = screen.getAllByText('Edit', { selector: 'button' });
    fireEvent.click(editButtons[3]); // Click the fourth Edit button (Date Format)

    const dateFormatSelect = screen.getByLabelText('Date Format');
    fireEvent.change(dateFormatSelect, { target: { value: 'DD/MM/YYYY' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(mockStore.getState().budget.currencyFormat.dateFormat).toBe('DD/MM/YYYY');
  });
}); 
 
 
 