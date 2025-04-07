import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, AnyAction } from '@reduxjs/toolkit';
import Dashboard from '@/components/Dashboard';
import { Category, Transaction, CurrencyFormat, BudgetState } from '@/types';

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
  useBudgetStats: () => ({
    totalBudget: 1500,
    totalSpent: 800,
    totalRemaining: 700,
    percentUsed: 53.33
  })
}));

const mockCategories: Category[] = [
  { id: '1', name: 'Food', budget: 1000 },
  { id: '2', name: 'Transport', budget: 500 }
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: -500,
    categoryId: '1',
    description: 'Groceries',
    date: '2024-03-15',
    type: 'expense',
    currency: 'USD'
  },
  {
    id: '2',
    amount: -300,
    categoryId: '2',
    description: 'Bus ticket',
    date: '2024-03-14',
    type: 'expense',
    currency: 'USD'
  }
];

const mockCurrencyFormat: CurrencyFormat = {
  currency: 'USD',
  placement: 'before',
  numberFormat: {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }
};

const initialState: BudgetState = {
  categories: mockCategories,
  transactions: mockTransactions,
  currentMonth: '2024-03',
  globalCurrency: 'USD',
  currencyFormat: mockCurrencyFormat,
  balance: 1000
};

describe('Dashboard', () => {
  const mockStore = configureStore({
    reducer: {
      budget: (state: BudgetState = initialState) => state
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the dashboard header', () => {
    render(
      <Provider store={mockStore}>
        <Dashboard />
      </Provider>
    );

    expect(screen.getByText('Budget Overview')).toBeInTheDocument();
    expect(screen.getByText('March 2024')).toBeInTheDocument();
  });

  it('displays budget statistics', () => {
    render(
      <Provider store={mockStore}>
        <Dashboard />
      </Provider>
    );

    expect(screen.getByText('$1,500.00')).toBeInTheDocument(); // Total budget
    expect(screen.getByText('$800.00')).toBeInTheDocument(); // Total spent
    expect(screen.getByText('$700.00')).toBeInTheDocument(); // Total remaining
    expect(screen.getByText('53.33%')).toBeInTheDocument(); // Percent used
  });

  it('renders category list', () => {
    render(
      <Provider store={mockStore}>
        <Dashboard />
      </Provider>
    );

    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText('Transport')).toBeInTheDocument();
  });

  it('renders transaction list', () => {
    render(
      <Provider store={mockStore}>
        <Dashboard />
      </Provider>
    );

    expect(screen.getByText('Recent Transactions')).toBeInTheDocument();
    expect(screen.getByText('Groceries')).toBeInTheDocument();
    expect(screen.getByText('Bus ticket')).toBeInTheDocument();
  });

  it('opens add category modal', () => {
    render(
      <Provider store={mockStore}>
        <Dashboard />
      </Provider>
    );

    const addCategoryButton = screen.getByRole('button', { name: /add category/i });
    fireEvent.click(addCategoryButton);

    expect(screen.getByText('Add New Category')).toBeInTheDocument();
  });

  it('opens add transaction modal', () => {
    render(
      <Provider store={mockStore}>
        <Dashboard />
      </Provider>
    );

    const addTransactionButton = screen.getByRole('button', { name: /add transaction/i });
    fireEvent.click(addTransactionButton);

    expect(screen.getByText('Add Transaction')).toBeInTheDocument();
  });

  it('handles month navigation', () => {
    const store = configureStore({
      reducer: {
        budget: (state: BudgetState = initialState, action: AnyAction): BudgetState => {
          if (action.type === 'budget/setCurrentMonth') {
            return {
              ...state,
              currentMonth: action.payload
            };
          }
          return state;
        }
      }
    });

    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );

    // Navigate to previous month
    const prevMonthButton = screen.getByRole('button', { name: /previous month/i });
    fireEvent.click(prevMonthButton);
    expect(store.getState().budget.currentMonth).toBe('2024-02');

    // Navigate to next month
    const nextMonthButton = screen.getByRole('button', { name: /next month/i });
    fireEvent.click(nextMonthButton);
    expect(store.getState().budget.currentMonth).toBe('2024-03');
  });
}); 