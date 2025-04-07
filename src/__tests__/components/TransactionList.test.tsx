import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, AnyAction } from '@reduxjs/toolkit';
import TransactionList from '@/components/TransactionList';
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

const mockCategories: Category[] = [
  { id: '1', name: 'Food', budget: 1000 },
  { id: '2', name: 'Transport', budget: 500 }
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: -50,
    categoryId: '1',
    description: 'Groceries',
    date: '2024-03-15',
    type: 'expense',
    currency: 'USD'
  },
  {
    id: '2',
    amount: -30,
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
  balance: 0
};

describe('TransactionList', () => {
  const mockStore = configureStore({
    reducer: {
      budget: (state: BudgetState = initialState) => state
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the transaction list', () => {
    render(
      <Provider store={mockStore}>
        <TransactionList />
      </Provider>
    );

    // Check for table headers
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();

    // Check for transaction data
    expect(screen.getByText('Groceries')).toBeInTheDocument();
    expect(screen.getByText('Bus ticket')).toBeInTheDocument();
    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText('Transport')).toBeInTheDocument();
    expect(screen.getByText('-$50.00')).toBeInTheDocument();
    expect(screen.getByText('-$30.00')).toBeInTheDocument();
  });

  it('handles editing a transaction', () => {
    const store = configureStore({
      reducer: {
        budget: (state: BudgetState = initialState, action: AnyAction): BudgetState => {
          if (action.type === 'budget/updateTransaction') {
            return {
              ...state,
              transactions: state.transactions.map(t =>
                t.id === action.payload.id ? action.payload : t
              )
            };
          }
          return state;
        }
      }
    });

    render(
      <Provider store={store}>
        <TransactionList />
      </Provider>
    );

    // Find and click description button for first transaction
    const descriptionButton = screen.getByText('Groceries');
    fireEvent.click(descriptionButton);

    // Update transaction description
    const descriptionInput = screen.getByDisplayValue('Groceries');
    fireEvent.change(descriptionInput, { target: { value: 'Supermarket' } });
    fireEvent.keyDown(descriptionInput, { key: 'Enter' });

    // Check if transaction was updated
    const updatedTransaction = store.getState().budget.transactions.find(t => t.id === '1');
    expect(updatedTransaction?.description).toBe('Supermarket');
  });

  it('sorts transactions by date', () => {
    render(
      <Provider store={mockStore}>
        <TransactionList />
      </Provider>
    );

    // Get all date cells
    const dateCells = screen.getAllByText(/Mar \d{1,2}, 2024/);
    
    // Check if dates are in descending order
    const dates = dateCells.map(cell => cell.textContent);
    expect(dates[0]).toBe('Mar 15, 2024');
    expect(dates[1]).toBe('Mar 14, 2024');
  });

  it('filters transactions by current month', () => {
    const storeWithOldTransaction = configureStore({
      reducer: {
        budget: () => ({
          ...initialState,
          transactions: [
            ...mockTransactions,
            {
              id: '3',
              amount: -100,
              categoryId: '1',
              description: 'Old transaction',
              date: '2024-02-15',
              type: 'expense',
              currency: 'USD'
            }
          ]
        })
      }
    });

    render(
      <Provider store={storeWithOldTransaction}>
        <TransactionList />
      </Provider>
    );

    // Should only show current month's transactions
    expect(screen.queryByText('Old transaction')).not.toBeInTheDocument();
    expect(screen.getByText('Groceries')).toBeInTheDocument();
    expect(screen.getByText('Bus ticket')).toBeInTheDocument();
  });
}); 