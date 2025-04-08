import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import AccountConnections from '@/components/AccountConnections';
import { BudgetState } from '@/types';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useConnectedAccounts } from '@/hooks/useConnectedAccounts';

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
    },
    dateFormat: ''
  },
  balance: 1000,
  budgetName: ''
};

const mockStore = configureStore({
  reducer: {
    budget: (state: BudgetState = initialState) => state
  }
});

const renderComponent = () => {
  render(
    <Provider store={mockStore}>
      <BrowserRouter>
        <AccountConnections />
      </BrowserRouter>
    </Provider>
  );
};

describe('AccountConnections', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.mock('@/hooks/useConnectedAccounts', () => ({
      useConnectedAccounts: () => ({
        accounts: [],
        isConnecting: false,
        error: null
      })
    }));
  });

  it('renders the account connections section', () => {
    renderComponent();
    expect(screen.getByText('Account Connections')).toBeInTheDocument();
  });

  it('displays the connect bank account button', () => {
    renderComponent();
    const connectButton = screen.getByRole('button', { name: /connect bank account/i });
    expect(connectButton).toBeInTheDocument();
  });

  it('opens the connection modal when clicking the connect button', () => {
    renderComponent();
    const connectButton = screen.getByRole('button', { name: /connect bank account/i });
    fireEvent.click(connectButton);
    expect(screen.getByText('Connect Your Bank Account')).toBeInTheDocument();
  });

  it('displays connected accounts list when accounts are present', () => {
    vi.mocked(useConnectedAccounts).mockImplementation(() => ({
      accounts: [
        { id: '1', name: 'Checking Account', balance: 1000 },
        { id: '2', name: 'Savings Account', balance: 5000 }
      ],
      isConnecting: false,
      error: null
    }));

    renderComponent();
    expect(screen.getByText('Connected Accounts')).toBeInTheDocument();
    expect(screen.getByText('Checking Account')).toBeInTheDocument();
    expect(screen.getByText('Savings Account')).toBeInTheDocument();
  });

  it('handles account disconnection', () => {
    const mockDisconnect = vi.fn();
    vi.mocked(useConnectedAccounts).mockImplementation(() => ({
      accounts: [{ id: '1', name: 'Checking Account', balance: 1000 }],
      disconnect: mockDisconnect,
      isConnecting: false,
      error: null
    }));

    renderComponent();
    const disconnectButton = screen.getByRole('button', { name: /disconnect/i });
    fireEvent.click(disconnectButton);
    expect(mockDisconnect).toHaveBeenCalledWith('1');
  });

  it('displays loading state while connecting', () => {
    vi.mocked(useConnectedAccounts).mockImplementation(() => ({
      accounts: [],
      isConnecting: true,
      error: null
    }));

    renderComponent();
    expect(screen.getByText('Connecting...')).toBeInTheDocument();
  });

  it('displays error message when connection fails', () => {
    vi.mocked(useConnectedAccounts).mockImplementation(() => ({
      accounts: [],
      isConnecting: false,
      error: 'Failed to connect to bank'
    }));

    renderComponent();
    expect(screen.getByText('Failed to connect to bank')).toBeInTheDocument();
  });
}); 