import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import CurrencySettings from '@/components/CurrencySettings';
import { BudgetState } from '@/types';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import budgetReducer from '@/store/budgetSlice';

describe('CurrencySettings', () => {
  const createMockStore = () => configureStore({
    reducer: {
      budget: budgetReducer
    },
    preloadedState: {
      budget: {
        categories: [],
        transactions: [],
        balance: 0,
        currentMonth: new Date().toISOString().slice(0, 7),
        globalCurrency: 'USD',
        budgetName: '',
        categoryGroups: [],
        currencyFormat: {
          currency: 'USD',
          placement: 'after',
          numberFormat: {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          },
          dateFormat: 'MM/DD/YYYY'
        }
      } as BudgetState
    }
  });

  let store = createMockStore();

  beforeEach(() => {
    store = createMockStore();
  });

  it('renders the currency settings form', () => {
    render(
      <Provider store={store}>
        <CurrencySettings />
      </Provider>
    );

    expect(screen.getByText('Currency Settings')).toBeInTheDocument();
    expect(screen.getByLabelText('Currency')).toBeInTheDocument();
    expect(screen.getByLabelText('Symbol Placement')).toBeInTheDocument();
  });

  it('displays current currency settings', () => {
    render(
      <Provider store={store}>
        <CurrencySettings />
      </Provider>
    );

    const currencySelect = screen.getByLabelText('Currency');
    const placementSelect = screen.getByLabelText('Symbol Placement');

    expect(currencySelect).toHaveValue('USD');
    expect(placementSelect).toHaveValue('after');
  });

  it('allows changing currency', () => {
    render(
      <Provider store={store}>
        <CurrencySettings />
      </Provider>
    );

    const currencySelect = screen.getByLabelText('Currency');
    fireEvent.change(currencySelect, { target: { value: 'EUR' } });

    expect(store.getState().budget.globalCurrency).toBe('EUR');
    expect(store.getState().budget.currencyFormat.currency).toBe('EUR');
  });

  it('allows changing symbol placement', () => {
    render(
      <Provider store={store}>
        <CurrencySettings />
      </Provider>
    );

    const placementSelect = screen.getByLabelText('Symbol Placement');
    fireEvent.change(placementSelect, { target: { value: 'before' } });

    expect(store.getState().budget.currencyFormat.placement).toBe('before');
  });

  it('updates decimal places settings', () => {
    render(
      <Provider store={store}>
        <CurrencySettings />
      </Provider>
    );

    const minDecimalInput = screen.getByLabelText('Minimum Decimal Places');
    const maxDecimalInput = screen.getByLabelText('Maximum Decimal Places');

    fireEvent.change(minDecimalInput, { target: { value: '1' } });
    fireEvent.change(maxDecimalInput, { target: { value: '3' } });

    const state = store.getState().budget.currencyFormat.numberFormat;
    expect(state.minimumFractionDigits).toBe(1);
    expect(state.maximumFractionDigits).toBe(3);
  });

  it('validates decimal places input', () => {
    render(
      <Provider store={store}>
        <CurrencySettings />
      </Provider>
    );

    const minDecimals = screen.getByLabelText(/minimum decimal places/i);
    const maxDecimals = screen.getByLabelText(/maximum decimal places/i);

    // Try to set minimum decimals to 3 (should be capped at max)
    fireEvent.change(minDecimals, { target: { value: '3' } });

    // Verify that the minimum decimals cannot exceed maximum
    const state = store.getState().budget.currencyFormat.numberFormat;
    expect(state.minimumFractionDigits).toBe(2);
    expect(state.maximumFractionDigits).toBe(2);

    // Set max decimals first, then min
    fireEvent.change(maxDecimals, { target: { value: '3' } });
    fireEvent.change(minDecimals, { target: { value: '2' } });

    const updatedState = store.getState().budget.currencyFormat.numberFormat;
    expect(updatedState.minimumFractionDigits).toBe(2);
    expect(updatedState.maximumFractionDigits).toBe(3);
  });

  it('prevents setting minimum decimals greater than maximum', () => {
    render(
      <Provider store={store}>
        <CurrencySettings />
      </Provider>
    );

    const minDecimals = screen.getByLabelText(/minimum decimal places/i);
    const maxDecimals = screen.getByLabelText(/maximum decimal places/i);

    // Set max decimals to 3
    fireEvent.change(maxDecimals, { target: { value: '3' } });
    // Try to set min decimals to 4 (should be capped at max)
    fireEvent.change(minDecimals, { target: { value: '4' } });

    const state = store.getState().budget.currencyFormat.numberFormat;
    expect(state.minimumFractionDigits).toBe(2); // Should remain at initial value
    expect(state.maximumFractionDigits).toBe(3);
  });

  it('displays preview of currency format', () => {
    render(
      <Provider store={store}>
        <CurrencySettings />
      </Provider>
    );

    // Initial state: currency after amount
    const previewText = screen.getByText(/1,234.56\$/);
    expect(previewText).toBeInTheDocument();

    // Change settings and verify preview updates
    const placement = screen.getByLabelText(/symbol placement/i);
    fireEvent.change(placement, { target: { value: 'before' } });

    const updatedPreviewText = screen.getByText(/\$1,234.56/);
    expect(updatedPreviewText).toBeInTheDocument();
  });
}); 