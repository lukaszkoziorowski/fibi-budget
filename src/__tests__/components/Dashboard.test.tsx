import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { vi } from 'vitest';
import Dashboard from '@/components/Dashboard';
import budgetReducer from '@/store/budgetSlice';
import { AuthProvider } from '@/contexts/AuthContext';
import { BudgetState } from '@/types';

// Mock Firebase auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn((_auth, callback) => {
    callback(null);
    return vi.fn();
  })
}));

// Mock formatters
vi.mock('@/utils/formatters', () => ({
  formatCurrency: (amount: number) => `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}));

// Mock the hooks
vi.mock('@/hooks/useCurrency', () => ({
  useCurrency: () => ({
    currencyFormat: {
      symbol: '$',
      decimal: '.',
      thousands: ',',
      precision: 2,
      format: '%s%v'
    }
  })
}));

vi.mock('@/hooks/useBudgetStats', () => ({
  useBudgetStats: () => ({
    assignedTotal: 5000,
    availableToAssign: 1000,
    totalTransactions: 10,
    totalExpenses: 4000
  })
}));

// Mock the CategoryGroups component
vi.mock('@/components/CategoryGroups', () => ({
  default: () => <div data-testid="category-groups" />
}));

// Mock the AddTransactionModal component
vi.mock('@/components/AddTransactionModal', () => ({
  default: () => <div data-testid="add-transaction-modal" />
}));

describe('Dashboard', () => {
  const createTestStore = () => {
    const initialState: BudgetState = {
      categories: [],
      categoryGroups: [],
      transactions: [],
      currentMonth: '2024-04-01T00:00:00.000Z',
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
      balance: 0,
      budgetName: 'My Budget'
    };

    return configureStore({
      reducer: {
        budget: budgetReducer
      },
      preloadedState: {
        budget: initialState
      }
    });
  };

  const renderDashboard = () => {
    const store = createTestStore();
    return render(
      <Provider store={store}>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </Provider>
    );
  };

  it('renders all dashboard cards with correct information', () => {
    renderDashboard();

    // Check Ready to Assign card
    expect(screen.getByText('Ready to Assign')).toBeInTheDocument();
    expect(screen.getByText('$1,000.00')).toBeInTheDocument();

    // Check Monthly Budget card
    expect(screen.getByText('Monthly Budget')).toBeInTheDocument();
    expect(screen.getByText('$5,000.00')).toBeInTheDocument();

    // Check Total Transactions card
    expect(screen.getByText('Total Transactions')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();

    // Check Total Expenses card
    expect(screen.getByText('Total Expenses')).toBeInTheDocument();
    expect(screen.getByText('$4,000.00')).toBeInTheDocument();
  });

  it('renders month selector with correct month', () => {
    renderDashboard();
    expect(screen.getByText('April 2024')).toBeInTheDocument();
  });

  it('handles month navigation correctly', () => {
    renderDashboard();
    
    // Click previous month button
    fireEvent.click(screen.getByLabelText('Previous month'));
    expect(screen.getByText('March 2024')).toBeInTheDocument();

    // Click next month button
    fireEvent.click(screen.getByLabelText('Next month'));
    expect(screen.getByText('April 2024')).toBeInTheDocument();
  });

  it('opens add transaction modal when clicking add transaction button', () => {
    renderDashboard();
    fireEvent.click(screen.getByText('Add Transaction'));
    expect(screen.getByTestId('add-transaction-modal')).toBeInTheDocument();
  });

  it('opens add group modal when clicking add group button', async () => {
    renderDashboard();
    const addGroupButton = screen.getByRole('button', { name: 'Add Group' });
    fireEvent.click(addGroupButton);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Add Group' })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter group name')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add Group' })).toBeInTheDocument();
      // Cancel button should not exist
      expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
    });
  });

  it('closes add group modal when clicking X button', async () => {
    renderDashboard();
    const addGroupButton = screen.getByRole('button', { name: 'Add Group' });
    fireEvent.click(addGroupButton);
    
    const closeButton = await screen.findByRole('button', { name: 'Close' });
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Add Group' })).not.toBeInTheDocument();
    });
  });

  it('adds a new group when submitting the form', async () => {
    renderDashboard();
    const addGroupButton = screen.getByRole('button', { name: 'Add Group' });
    fireEvent.click(addGroupButton);
    
    const input = await screen.findByPlaceholderText('Enter group name');
    fireEvent.change(input, { target: { value: 'Test Group' } });
    
    const addButton = screen.getByRole('button', { name: 'Add Group' });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Add Group' })).not.toBeInTheDocument();
    });
  });

  it('handles responsive layout correctly', () => {
    renderDashboard();
    
    // Check if cards are in a responsive grid
    const cardsContainer = screen.getByTestId('dashboard-cards');
    expect(cardsContainer).toHaveClass('grid-cols-1');
    expect(cardsContainer).toHaveClass('sm:grid-cols-2');
    expect(cardsContainer).toHaveClass('lg:grid-cols-4');
  });
}); 