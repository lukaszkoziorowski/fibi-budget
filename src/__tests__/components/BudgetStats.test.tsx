import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import BudgetStats from '@/components/BudgetStats';
import { BudgetState } from '@/types';

// Mock the useBudgetStats hook
jest.mock('@/hooks/useBudgetStats', () => ({
  useBudgetStats: () => ({
    assignedTotal: 2000,
    totalExpenses: 1200,
    availableToAssign: 800,
    balance: 2800,
    totalTransactions: 5,
    getCategoryStats: () => ({})
  })
}));

// Mock the useCurrency hook
jest.mock('@/hooks/useCurrency', () => ({
  useCurrency: () => ({
    currencyFormat: {
      currency: 'USD',
      placement: 'before',
      numberFormat: {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    },
    currencySymbol: '$'
  })
}));

const initialState: BudgetState = {
  categories: [
    { id: '1', name: 'Food', budget: 1000 },
    { id: '2', name: 'Transport', budget: 1000 }
  ],
  transactions: [
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
      amount: -700,
      categoryId: '2',
      description: 'Bus ticket',
      date: '2024-03-14',
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
    }
  },
  balance: 1000
};

describe('BudgetStats', () => {
  const mockStore = configureStore({
    reducer: {
      budget: (state: BudgetState = initialState) => state
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the budget statistics', () => {
    render(
      <Provider store={mockStore}>
        <BudgetStats />
      </Provider>
    );

    expect(screen.getByText('Total Budget')).toBeInTheDocument();
    expect(screen.getByText('$2,000.00')).toBeInTheDocument();
  });

  it('displays total spent amount', () => {
    render(
      <Provider store={mockStore}>
        <BudgetStats />
      </Provider>
    );

    expect(screen.getByText('Total Spent')).toBeInTheDocument();
    expect(screen.getByText('$1,200.00')).toBeInTheDocument();
  });

  it('displays remaining budget', () => {
    render(
      <Provider store={mockStore}>
        <BudgetStats />
      </Provider>
    );

    expect(screen.getByText('Remaining')).toBeInTheDocument();
    expect(screen.getByText('$800.00')).toBeInTheDocument();
  });

  it('displays budget usage percentage', () => {
    render(
      <Provider store={mockStore}>
        <BudgetStats />
      </Provider>
    );

    expect(screen.getByText('60.0%')).toBeInTheDocument();
  });

  it('displays progress bar with correct percentage', () => {
    render(
      <Provider store={mockStore}>
        <BudgetStats />
      </Provider>
    );

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '60');
  });

  it('applies warning color when budget usage is high', () => {
    // Mock the useBudgetStats hook with high usage
    jest.mock('@/hooks/useBudgetStats', () => ({
      useBudgetStats: () => ({
        assignedTotal: 2000,
        totalExpenses: 1800,
        availableToAssign: 200,
        balance: 2000,
        totalTransactions: 5,
        getCategoryStats: () => ({})
      })
    }));

    render(
      <Provider store={mockStore}>
        <BudgetStats />
      </Provider>
    );

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveClass('warning');
  });

  it('applies danger color when budget is exceeded', () => {
    // Mock the useBudgetStats hook with exceeded budget
    jest.mock('@/hooks/useBudgetStats', () => ({
      useBudgetStats: () => ({
        assignedTotal: 2000,
        totalExpenses: 2200,
        availableToAssign: -200,
        balance: 2000,
        totalTransactions: 5,
        getCategoryStats: () => ({})
      })
    }));

    render(
      <Provider store={mockStore}>
        <BudgetStats />
      </Provider>
    );

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveClass('danger');
  });

  it('handles zero budget case', () => {
    // Mock the useBudgetStats hook with zero budget
    jest.mock('@/hooks/useBudgetStats', () => ({
      useBudgetStats: () => ({
        assignedTotal: 0,
        totalExpenses: 0,
        availableToAssign: 0,
        balance: 0,
        totalTransactions: 0,
        getCategoryStats: () => ({})
      })
    }));

    render(
      <Provider store={mockStore}>
        <BudgetStats />
      </Provider>
    );

    expect(screen.getByText('$0.00')).toBeInTheDocument();
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
  });
}); 