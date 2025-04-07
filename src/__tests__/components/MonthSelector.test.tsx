import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, AnyAction } from '@reduxjs/toolkit';
import MonthSelector from '@/components/MonthSelector';
import { BudgetState } from '@/types';

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

describe('MonthSelector', () => {
  const mockStore = configureStore({
    reducer: {
      budget: (state: BudgetState = initialState, action: AnyAction): BudgetState => {
        switch (action.type) {
          case 'budget/setCurrentMonth':
            return {
              ...state,
              currentMonth: action.payload as string
            };
          default:
            return state;
        }
      }
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the current month', () => {
    render(
      <Provider store={mockStore}>
        <MonthSelector />
      </Provider>
    );

    expect(screen.getByText('March 2024')).toBeInTheDocument();
  });

  it('displays navigation buttons', () => {
    render(
      <Provider store={mockStore}>
        <MonthSelector />
      </Provider>
    );

    expect(screen.getByRole('button', { name: /previous month/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next month/i })).toBeInTheDocument();
  });

  it('navigates to previous month', () => {
    render(
      <Provider store={mockStore}>
        <MonthSelector />
      </Provider>
    );

    const prevButton = screen.getByRole('button', { name: /previous month/i });
    fireEvent.click(prevButton);

    expect(mockStore.getState().budget.currentMonth).toBe('2024-02');
  });

  it('navigates to next month', () => {
    render(
      <Provider store={mockStore}>
        <MonthSelector />
      </Provider>
    );

    const nextButton = screen.getByRole('button', { name: /next month/i });
    fireEvent.click(nextButton);

    expect(mockStore.getState().budget.currentMonth).toBe('2024-04');
  });

  it('displays month selector dropdown', () => {
    render(
      <Provider store={mockStore}>
        <MonthSelector />
      </Provider>
    );

    const monthSelect = screen.getByRole('combobox', { name: /select month/i });
    expect(monthSelect).toBeInTheDocument();
  });

  it('allows selecting a month from dropdown', () => {
    render(
      <Provider store={mockStore}>
        <MonthSelector />
      </Provider>
    );

    const monthSelect = screen.getByRole('combobox', { name: /select month/i });
    fireEvent.change(monthSelect, { target: { value: '2024-06' } });

    expect(mockStore.getState().budget.currentMonth).toBe('2024-06');
  });

  it('displays year selector', () => {
    render(
      <Provider store={mockStore}>
        <MonthSelector />
      </Provider>
    );

    const yearSelect = screen.getByRole('combobox', { name: /select year/i });
    expect(yearSelect).toBeInTheDocument();
  });

  it('allows selecting a different year', () => {
    render(
      <Provider store={mockStore}>
        <MonthSelector />
      </Provider>
    );

    const yearSelect = screen.getByRole('combobox', { name: /select year/i });
    fireEvent.change(yearSelect, { target: { value: '2025' } });

    expect(mockStore.getState().budget.currentMonth).toBe('2025-03');
  });

  it('handles invalid date navigation', () => {
    // Set initial state to February 2024
    mockStore.dispatch({ type: 'budget/setCurrentMonth', payload: '2024-02' });

    render(
      <Provider store={mockStore}>
        <MonthSelector />
      </Provider>
    );

    // Try to navigate to previous month (January 2024)
    const prevButton = screen.getByRole('button', { name: /previous month/i });
    fireEvent.click(prevButton);

    expect(mockStore.getState().budget.currentMonth).toBe('2024-01');

    // Try to navigate to next month (March 2024)
    const nextButton = screen.getByRole('button', { name: /next month/i });
    fireEvent.click(nextButton);

    expect(mockStore.getState().budget.currentMonth).toBe('2024-02');
  });

  it('formats month names correctly', () => {
    const months = [
      '2024-01', '2024-02', '2024-03', '2024-04',
      '2024-05', '2024-06', '2024-07', '2024-08',
      '2024-09', '2024-10', '2024-11', '2024-12'
    ];

    const expectedNames = [
      'January 2024', 'February 2024', 'March 2024', 'April 2024',
      'May 2024', 'June 2024', 'July 2024', 'August 2024',
      'September 2024', 'October 2024', 'November 2024', 'December 2024'
    ];

    months.forEach((month, index) => {
      mockStore.dispatch({ type: 'budget/setCurrentMonth', payload: month });

      render(
        <Provider store={mockStore}>
          <MonthSelector />
        </Provider>
      );

      expect(screen.getByText(expectedNames[index])).toBeInTheDocument();
    });
  });
}); 