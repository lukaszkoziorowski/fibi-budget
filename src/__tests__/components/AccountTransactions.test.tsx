import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import AccountTransactions from '../../components/Accounts/AccountTransactions';
import accountReducer from '../../store/accountSlice';
import { Account, Transaction } from '../../types/account';

const mockAccount: Account = {
  id: '1',
  name: 'Test Account',
  type: 'checking',
  balance: 1000,
  institutionName: 'Test Bank',
  userId: 'user1',
  isActive: true,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const mockTransactions: Transaction[] = [
  {
    id: '1',
    accountId: '1',
    amount: 100,
    description: 'Reconciled Transaction',
    date: '2024-01-01',
    userId: 'user1',
    isReconciled: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    accountId: '1',
    amount: -50,
    description: 'Unreconciled Transaction',
    date: '2024-01-02',
    userId: 'user1',
    isReconciled: false,
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
];

const mockOnBack = jest.fn();

const renderWithProvider = (component: React.ReactElement) => {
  const store = configureStore({
    reducer: {
      accounts: accountReducer,
    },
    preloadedState: {
      accounts: {
        accounts: [mockAccount],
        transactions: mockTransactions,
        isLoading: false,
        error: null,
      },
    },
  });

  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('AccountTransactions Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders account details correctly', () => {
    renderWithProvider(<AccountTransactions accountId="1" onBack={mockOnBack} />);
    
    expect(screen.getByText('Test Account')).toBeInTheDocument();
    expect(screen.getByText('$1,000.00')).toBeInTheDocument(); // Cleared Balance
    expect(screen.getByText('-$50.00')).toBeInTheDocument(); // Uncleared Balance
    expect(screen.getByText('$950.00')).toBeInTheDocument(); // Working Balance
  });

  it('shows transaction list', () => {
    renderWithProvider(<AccountTransactions accountId="1" onBack={mockOnBack} />);
    
    expect(screen.getByText('Reconciled Transaction')).toBeInTheDocument();
    expect(screen.getByText('Unreconciled Transaction')).toBeInTheDocument();
  });

  it('navigates back when clicking back button', () => {
    renderWithProvider(<AccountTransactions accountId="1" onBack={mockOnBack} />);
    
    const backButton = screen.getByRole('button');
    fireEvent.click(backButton);
    
    expect(mockOnBack).toHaveBeenCalled();
  });

  it('returns null for non-existent account', () => {
    const { container } = renderWithProvider(
      <AccountTransactions accountId="non-existent" onBack={mockOnBack} />
    );
    
    expect(container.firstChild).toBeNull();
  });
}); 