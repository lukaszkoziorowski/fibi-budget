import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import AccountTransactionPage from '../../components/Accounts/AccountTransactionPage';
import accountsReducer from '../../store/accountsSlice';
import budgetReducer from '../../store/budgetSlice';

const mockAccount = {
  id: '1',
  name: 'Test Account',
  type: 'checking' as const,
  balance: 1000,
  currency: 'USD',
  color: '#9333ea',
  isHidden: false,
  notes: null,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const mockTransactions = [
  {
    id: '1',
    accountId: '1',
    amount: 500,
    currency: 'USD',
    date: '2024-01-01',
    description: 'Initial Balance',
    type: 'credit' as const,
    isReconciled: true,
    categoryId: 'cat1',
    memo: 'Initial deposit',
  },
  {
    id: '2',
    accountId: '1',
    amount: -100,
    currency: 'USD',
    date: '2024-01-02',
    description: 'Grocery Shopping',
    type: 'debit' as const,
    isReconciled: false,
    categoryId: 'cat2',
    memo: 'Weekly groceries',
  },
];

const renderWithProviders = (accountId: string) => {
  const store = configureStore({
    reducer: {
      accounts: accountsReducer,
      budget: budgetReducer,
    },
    preloadedState: {
      accounts: {
        accounts: [mockAccount],
        transactions: mockTransactions,
        activeAccountId: mockAccount.id,
      },
      budget: {
        globalCurrency: 'USD',
        currencyFormat: {
          locale: 'en-US',
          currency: 'USD',
          placement: 'before' as const,
          numberFormat: {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          },
          dateFormat: 'MM/DD/YYYY' as const,
        },
        categories: [],
        categoryGroups: [],
        transactions: [],
        currentMonth: new Date().toISOString(),
        budgetName: 'Test Budget',
        isInitialized: true,
        balance: 0,
      },
    },
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>
        <AccountTransactionPage accountId={accountId} />
      </BrowserRouter>
    </Provider>
  );
};

describe('AccountTransactionPage', () => {
  it('renders account name and balances', () => {
    renderWithProviders('1');
    
    expect(screen.getByText('Test Account')).toBeInTheDocument();
    expect(screen.getByText('Not Yet Reconciled')).toBeInTheDocument();
    expect(screen.getByText('$1,000.00')).toBeInTheDocument(); // Cleared Balance
    expect(screen.getByText('-$100.00')).toBeInTheDocument(); // Uncleared Balance
    expect(screen.getByText('$900.00')).toBeInTheDocument(); // Working Balance
  });

  it('renders transaction list', () => {
    renderWithProviders('1');
    
    expect(screen.getByText('Initial Balance')).toBeInTheDocument();
    expect(screen.getByText('Grocery Shopping')).toBeInTheDocument();
  });

  it('returns null for non-existent account', () => {
    const { container } = renderWithProviders('non-existent-id');
    expect(container).toBeEmptyDOMElement();
  });

  it('renders account header correctly', () => {
    renderWithProviders('1');
    expect(screen.getByText('Test Account')).toBeInTheDocument();
  });

  it('displays correct balance information', () => {
    renderWithProviders('1');
    
    // Find balance elements by their labels and then get their values
    const clearedBalanceSection = screen.getByText('Cleared Balance').closest('div');
    const unclearedBalanceSection = screen.getByText('Uncleared Balance').closest('div');
    const workingBalanceSection = screen.getByText('Working Balance').closest('div');
    
    expect(clearedBalanceSection?.querySelector('p')?.textContent).toBe('$1,000.00');
    expect(unclearedBalanceSection?.querySelector('p')?.textContent).toBe('-$100.00');
    expect(workingBalanceSection?.querySelector('p')?.textContent).toBe('$900.00');
  });

  it('shows all action buttons', () => {
    renderWithProviders('1');
    expect(screen.getByText('Add Transaction')).toBeInTheDocument();
    expect(screen.getByText('Link Account')).toBeInTheDocument();
    expect(screen.getByText('File Import')).toBeInTheDocument();
    expect(screen.getByText('Undo')).toBeInTheDocument();
    expect(screen.getByText('Redo')).toBeInTheDocument();
  });

  it('displays transaction list with correct columns', () => {
    renderWithProviders('1');
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Payee')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Memo')).toBeInTheDocument();
    expect(screen.getByText('Outflow')).toBeInTheDocument();
    expect(screen.getByText('Inflow')).toBeInTheDocument();
  });

  it('shows transactions in the list', () => {
    renderWithProviders('1');
    expect(screen.getByText('Initial Balance')).toBeInTheDocument();
    expect(screen.getByText('Grocery Shopping')).toBeInTheDocument();
  });

  it('shows reconcile button', () => {
    renderWithProviders('1');
    expect(screen.getByText('Reconcile')).toBeInTheDocument();
  });

  it('shows search input', () => {
    renderWithProviders('1');
    expect(screen.getByPlaceholderText('Search Test Account')).toBeInTheDocument();
  });
}); 