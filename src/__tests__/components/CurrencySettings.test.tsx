import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, AnyAction } from '@reduxjs/toolkit';
import CurrencySettings from '@/components/CurrencySettings';
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
    }
  },
  balance: 1000
};

describe('CurrencySettings', () => {
  const mockStore = configureStore({
    reducer: {
      budget: (state: BudgetState = initialState, action: AnyAction): BudgetState => {
        switch (action.type) {
          case 'budget/setGlobalCurrency':
            return {
              ...state,
              globalCurrency: action.payload as string
            };
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
    vi.clearAllMocks();
  });

  it('renders the currency settings form', () => {
    render(
      <Provider store={mockStore}>
        <CurrencySettings />
      </Provider>
    );

    expect(screen.getByText('Currency Settings')).toBeInTheDocument();
    expect(screen.getByLabelText('Currency')).toBeInTheDocument();
    expect(screen.getByLabelText('Symbol Placement')).toBeInTheDocument();
  });

  it('displays current currency settings', () => {
    render(
      <Provider store={mockStore}>
        <CurrencySettings />
      </Provider>
    );

    const currencySelect = screen.getByLabelText('Currency');
    const placementSelect = screen.getByLabelText('Symbol Placement');

    expect(currencySelect).toHaveValue('USD');
    expect(placementSelect).toHaveValue('before');
  });

  it('allows changing currency', () => {
    render(
      <Provider store={mockStore}>
        <CurrencySettings />
      </Provider>
    );

    const currencySelect = screen.getByLabelText('Currency');
    fireEvent.change(currencySelect, { target: { value: 'EUR' } });

    expect(mockStore.getState().budget.globalCurrency).toBe('EUR');
  });

  it('allows changing symbol placement', () => {
    render(
      <Provider store={mockStore}>
        <CurrencySettings />
      </Provider>
    );

    const placementSelect = screen.getByLabelText('Symbol Placement');
    fireEvent.change(placementSelect, { target: { value: 'after' } });

    expect(mockStore.getState().budget.currencyFormat.placement).toBe('after');
  });

  it('updates decimal places settings', () => {
    render(
      <Provider store={mockStore}>
        <CurrencySettings />
      </Provider>
    );

    const minDecimalInput = screen.getByLabelText('Minimum Decimal Places');
    const maxDecimalInput = screen.getByLabelText('Maximum Decimal Places');

    fireEvent.change(minDecimalInput, { target: { value: '1' } });
    fireEvent.change(maxDecimalInput, { target: { value: '3' } });

    const state = mockStore.getState().budget.currencyFormat.numberFormat;
    expect(state.minimumFractionDigits).toBe(1);
    expect(state.maximumFractionDigits).toBe(3);
  });

  it('validates decimal places input', () => {
    render(
      <Provider store={mockStore}>
        <CurrencySettings />
      </Provider>
    );

    const minDecimalInput = screen.getByLabelText('Minimum Decimal Places');
    const maxDecimalInput = screen.getByLabelText('Maximum Decimal Places');

    // Try setting invalid values
    fireEvent.change(minDecimalInput, { target: { value: '-1' } });
    fireEvent.change(maxDecimalInput, { target: { value: '5' } });

    const state = mockStore.getState().budget.currencyFormat.numberFormat;
    expect(state.minimumFractionDigits).toBe(2); // Should remain unchanged
    expect(state.maximumFractionDigits).toBe(2); // Should remain unchanged

    expect(screen.getByText('Minimum decimal places must be between 0 and 4')).toBeInTheDocument();
    expect(screen.getByText('Maximum decimal places must be between 0 and 4')).toBeInTheDocument();
  });

  it('prevents setting minimum decimals greater than maximum', () => {
    render(
      <Provider store={mockStore}>
        <CurrencySettings />
      </Provider>
    );

    const minDecimalInput = screen.getByLabelText('Minimum Decimal Places');
    const maxDecimalInput = screen.getByLabelText('Maximum Decimal Places');

    fireEvent.change(maxDecimalInput, { target: { value: '2' } });
    fireEvent.change(minDecimalInput, { target: { value: '3' } });

    const state = mockStore.getState().budget.currencyFormat.numberFormat;
    expect(state.minimumFractionDigits).toBe(2); // Should remain unchanged
    expect(state.maximumFractionDigits).toBe(2); // Should remain unchanged

    expect(screen.getByText('Minimum decimal places cannot be greater than maximum')).toBeInTheDocument();
  });

  it('displays preview of currency format', () => {
    render(
      <Provider store={mockStore}>
        <CurrencySettings />
      </Provider>
    );

    expect(screen.getByText('Preview: $1,234.56')).toBeInTheDocument();

    // Change settings and verify preview updates
    const currencySelect = screen.getByLabelText('Currency');
    const placementSelect = screen.getByLabelText('Symbol Placement');

    fireEvent.change(currencySelect, { target: { value: 'EUR' } });
    fireEvent.change(placementSelect, { target: { value: 'after' } });

    expect(screen.getByText('Preview: 1,234.56€')).toBeInTheDocument();
  });
}); 