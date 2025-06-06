import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, AnyAction } from '@reduxjs/toolkit';
import AddTransactionModal from '@/components/AddTransactionModal';
import { Category, CurrencyFormat, BudgetState } from '@/types';

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
  {
    id: '1', name: 'Food', budget: 1000,
    groupId: null,
    userId: '',
    createdAt: '',
    updatedAt: ''
  },
  {
    id: '2', name: 'Transport', budget: 500,
    groupId: null,
    userId: '',
    createdAt: '',
    updatedAt: ''
  }
];

const mockCurrencyFormat: CurrencyFormat = {
  currency: 'USD',
  placement: 'before',
  numberFormat: {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  },
  dateFormat: '',
  locale: ''
};

const initialState: BudgetState = {
  categories: mockCategories,
  transactions: [],
  currentMonth: '2024-03',
  globalCurrency: 'USD',
  currencyFormat: mockCurrencyFormat,
  balance: 0,
  budgetName: '',
  categoryGroups: []
};

describe('AddTransactionModal', () => {
  const mockOnClose = jest.fn();

  const mockStore = configureStore({
    reducer: {
      budget: (state: BudgetState = initialState) => state
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal', () => {
    render(
      <Provider store={mockStore}>
        <AddTransactionModal isOpen={true} onClose={mockOnClose} />
      </Provider>
    );

    expect(screen.getByText('Add Transaction')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Amount')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Date')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add transaction/i })).toBeInTheDocument();
  });

  it('handles adding an expense transaction', () => {
    const store = configureStore({
      reducer: {
        budget: (state: BudgetState = initialState, action: AnyAction): BudgetState => {
          if (action.type === 'budget/addTransaction') {
            return {
              ...state,
              transactions: [...state.transactions, action.payload]
            };
          }
          return state;
        }
      }
    });

    render(
      <Provider store={store}>
        <AddTransactionModal isOpen={true} onClose={mockOnClose} />
      </Provider>
    );

    // Fill in the form
    const descriptionInput = screen.getByLabelText('Description');
    const amountInput = screen.getByLabelText('Amount');
    const categorySelect = screen.getByLabelText('Category');
    const typeSelect = screen.getByLabelText('Type');
    const dateInput = screen.getByLabelText('Date');

    fireEvent.change(descriptionInput, { target: { value: 'Groceries' } });
    fireEvent.change(amountInput, { target: { value: '50' } });
    fireEvent.change(categorySelect, { target: { value: '1' } });
    fireEvent.change(typeSelect, { target: { value: 'expense' } });
    fireEvent.change(dateInput, { target: { value: '2024-03-15' } });

    // Submit the form
    const addButton = screen.getByRole('button', { name: /add transaction/i });
    fireEvent.click(addButton);

    // Check if the transaction was added
    const transactions = store.getState().budget.transactions;
    expect(transactions).toHaveLength(1);
    expect(transactions[0]).toMatchObject({
      description: 'Groceries',
      amount: -50,
      categoryId: '1',
      type: 'expense',
      date: '2024-03-15',
      currency: 'USD'
    });

    // Check if the modal was closed
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('handles adding an income transaction', () => {
    const store = configureStore({
      reducer: {
        budget: (state: BudgetState = initialState, action: AnyAction): BudgetState => {
          if (action.type === 'budget/addTransaction') {
            return {
              ...state,
              transactions: [...state.transactions, action.payload]
            };
          }
          return state;
        }
      }
    });

    render(
      <Provider store={store}>
        <AddTransactionModal isOpen={true} onClose={mockOnClose} />
      </Provider>
    );

    // Fill in the form
    const descriptionInput = screen.getByLabelText('Description');
    const amountInput = screen.getByLabelText('Amount');
    const categorySelect = screen.getByLabelText('Category');
    const typeSelect = screen.getByLabelText('Type');
    const dateInput = screen.getByLabelText('Date');

    fireEvent.change(descriptionInput, { target: { value: 'Salary' } });
    fireEvent.change(amountInput, { target: { value: '1000' } });
    fireEvent.change(categorySelect, { target: { value: '1' } });
    fireEvent.change(typeSelect, { target: { value: 'income' } });
    fireEvent.change(dateInput, { target: { value: '2024-03-15' } });

    // Submit the form
    const addButton = screen.getByRole('button', { name: /add transaction/i });
    fireEvent.click(addButton);

    // Check if the transaction was added
    const transactions = store.getState().budget.transactions;
    expect(transactions).toHaveLength(1);
    expect(transactions[0]).toMatchObject({
      description: 'Salary',
      amount: 1000,
      categoryId: '1',
      type: 'income',
      date: '2024-03-15',
      currency: 'USD'
    });

    // Check if the modal was closed
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('validates input before adding a transaction', () => {
    render(
      <Provider store={mockStore}>
        <AddTransactionModal isOpen={true} onClose={mockOnClose} />
      </Provider>
    );

    // Try to submit with empty inputs
    const addButton = screen.getByRole('button', { name: /add transaction/i });
    fireEvent.click(addButton);

    // Verify modal wasn't closed (empty inputs)
    expect(mockOnClose).not.toHaveBeenCalled();

    // Fill in invalid amount
    const amountInput = screen.getByLabelText('Amount');
    fireEvent.change(amountInput, { target: { value: '-100' } });

    // Submit with negative amount
    fireEvent.click(addButton);

    // Verify modal wasn't closed (invalid amount)
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('closes the modal when clicking the X button', () => {
    render(
      <Provider store={mockStore}>
        <AddTransactionModal isOpen={true} onClose={mockOnClose} />
      </Provider>
    );

    const closeButton = screen.getByRole('button', { name: /close modal/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
}); 