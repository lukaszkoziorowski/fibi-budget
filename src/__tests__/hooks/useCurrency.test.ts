import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useCurrency } from '@/hooks/useCurrency';
import { BudgetState } from '@/types';
import type { PropsWithChildren } from 'react';
import React from 'react';

const initialState: BudgetState = {
  categories: [],
  transactions: [],
  currentMonth: '2024-03',
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
  balance: 1000,
  budgetName: '',
  categoryGroups: []
};

const createWrapper = (state: BudgetState) => {
  return function Wrapper({ children }: PropsWithChildren) {
    const store = configureStore({
      reducer: {
        budget: () => state
      }
    });

    return React.createElement(Provider, { store, children }, null);
  };
};

describe('useCurrency', () => {
  it('returns currency format from state', () => {
    const { result } = renderHook(() => useCurrency(), { wrapper: createWrapper(initialState) });
    expect(result.current.currencyFormat).toEqual(initialState.currencyFormat);
  });

  it('returns correct currency symbol for USD', () => {
    const { result } = renderHook(() => useCurrency(), { wrapper: createWrapper(initialState) });
    expect(result.current.currencySymbol).toBe('$');
  });

  it('returns correct currency symbol for EUR', () => {
    const stateWithEUR: BudgetState = {
      ...initialState,
      globalCurrency: 'EUR',
      currencyFormat: {
        ...initialState.currencyFormat,
        currency: 'EUR',
        locale: 'de-DE'
      }
    };

    const { result } = renderHook(() => useCurrency(), { wrapper: createWrapper(stateWithEUR) });
    expect(result.current.currencySymbol).toBe('€');
  });

  it('returns correct currency symbol for GBP', () => {
    const stateWithGBP: BudgetState = {
      ...initialState,
      globalCurrency: 'GBP',
      currencyFormat: {
        ...initialState.currencyFormat,
        currency: 'GBP',
        locale: 'en-GB'
      }
    };

    const { result } = renderHook(() => useCurrency(), { wrapper: createWrapper(stateWithGBP) });
    expect(result.current.currencySymbol).toBe('£');
  });

  it('returns correct currency symbol for JPY', () => {
    const stateWithJPY: BudgetState = {
      ...initialState,
      globalCurrency: 'JPY',
      currencyFormat: {
        ...initialState.currencyFormat,
        currency: 'JPY',
        locale: 'ja-JP'
      }
    };

    const { result } = renderHook(() => useCurrency(), { wrapper: createWrapper(stateWithJPY) });
    expect(result.current.currencySymbol).toBe('¥');
  });

  it('returns currency code as symbol for unsupported currency', () => {
    const stateWithCustomCurrency: BudgetState = {
      ...initialState,
      globalCurrency: 'XYZ',
      currencyFormat: {
        ...initialState.currencyFormat,
        currency: 'XYZ',
        locale: 'en-US'
      }
    };

    const { result } = renderHook(() => useCurrency(), { wrapper: createWrapper(stateWithCustomCurrency) });
    expect(result.current.currencySymbol).toBe('XYZ');
  });
}); 