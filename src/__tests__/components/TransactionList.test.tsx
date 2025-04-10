import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import TransactionList from '../../components/Accounts/TransactionList';
import accountReducer from '../../store/accountSlice';
import { Transaction } from '../../types/account';

const mockTransactions: Transaction[] = [
  {
    id: '1',
    accountId: 'account1',
    amount: 100,
    description: 'Salary',
    date: '2024-01-01',
    userId: 'user1',
    isReconciled: false,
    categoryId: undefined,
    memo: undefined,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    accountId: 'account1',
    amount: -50,
    description: 'Groceries',
    date: '2024-01-02',
    userId: 'user1',
    isReconciled: false,
    categoryId: undefined,
    memo: undefined,
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
];

const renderWithProvider = (component: React.ReactElement) => {
  const store = configureStore({
    reducer: {
      accounts: accountReducer,
    },
    preloadedState: {
      accounts: {
        accounts: [],
        transactions: mockTransactions,
        isLoading: false,
        error: null,
        activeAccountId: null,
      },
    },
  });

  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('TransactionList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders transactions correctly', () => {
    renderWithProvider(<TransactionList accountId="account1" />);
    
    expect(screen.getByText('Salary')).toBeInTheDocument();
    expect(screen.getByText('Groceries')).toBeInTheDocument();
    expect(screen.getByText('$100.00')).toBeInTheDocument();
    expect(screen.getByText('-$50.00')).toBeInTheDocument();
  });

  it('shows add transaction form when button is clicked', () => {
    renderWithProvider(<TransactionList accountId="account1" />);
    
    const addButton = screen.getByText('+ Add Transaction');
    fireEvent.click(addButton);
    
    expect(screen.getByLabelText('Amount')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Date')).toBeInTheDocument();
  });

  it('adds new transaction when form is submitted', async () => {
    renderWithProvider(<TransactionList accountId="account1" />);
    
    const addButton = screen.getByText('+ Add Transaction');
    fireEvent.click(addButton);
    
    fireEvent.change(screen.getByLabelText('Amount'), {
      target: { value: '75' },
    });
    
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'New Transaction' },
    });
    
    const submitButton = screen.getByRole('button', { name: /add/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('New Transaction')).toBeInTheDocument();
      expect(screen.getByText('$75.00')).toBeInTheDocument();
    });
  });

  it('deletes transaction when confirmed', async () => {
    const mockConfirm = jest.spyOn(window, 'confirm');
    mockConfirm.mockImplementation(() => true);
    
    renderWithProvider(<TransactionList accountId="account1" />);
    
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);
    
    await waitFor(() => {
      expect(screen.queryByText('Salary')).not.toBeInTheDocument();
    });
    
    mockConfirm.mockRestore();
  });

  it('validates required fields in add transaction form', () => {
    renderWithProvider(<TransactionList accountId="account1" />);
    
    const addButton = screen.getByText('+ Add Transaction');
    fireEvent.click(addButton);
    
    const submitButton = screen.getByRole('button', { name: /add/i });
    fireEvent.click(submitButton);
    
    expect(screen.getByLabelText('Amount')).toBeInvalid();
    expect(screen.getByLabelText('Description')).toBeInvalid();
  });
}); 