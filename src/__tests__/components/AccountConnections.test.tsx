import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import AccountConnections from '@/components/AccountConnections';
import { BudgetState } from '@/types';
import { describe, it, expect, beforeEach, vi } from 'vitest';

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

describe('AccountConnections', () => {
  const mockStore = configureStore({
    reducer: {
      budget: (state: BudgetState = initialState) => state
    }
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the account connections section', () => {
    render(
      <Provider store={mockStore}>
        <AccountConnections />
      </Provider>
    );

    expect(screen.getByText('Account Connections')).toBeInTheDocument();
  });

  it('displays the connect bank account button', () => {
    render(
      <Provider store={mockStore}>
        <AccountConnections />
      </Provider>
    );

    const connectButton = screen.getByRole('button', { name: /connect bank account/i });
    expect(connectButton).toBeInTheDocument();
  });

  it('opens the connection modal when clicking the connect button', () => {
    render(
      <Provider store={mockStore}>
        <AccountConnections />
      </Provider>
    );

    const connectButton = screen.getByRole('button', { name: /connect bank account/i });
    fireEvent.click(connectButton);

    expect(screen.getByText('Connect Your Bank Account')).toBeInTheDocument();
  });

  it('displays connected accounts list when accounts are present', () => {
    // Mock the useConnectedAccounts hook to return some accounts
    vi.mock('@/hooks/useConnectedAccounts', () => ({
      useConnectedAccounts: () => ({
        accounts: [
          { id: '1', name: 'Checking Account', balance: 1000 },
          { id: '2', name: 'Savings Account', balance: 5000 }
        ]
      })
    }));

    render(
      <Provider store={mockStore}>
        <AccountConnections />
      </Provider>
    );

    expect(screen.getByText('Connected Accounts')).toBeInTheDocument();
    expect(screen.getByText('Checking Account')).toBeInTheDocument();
    expect(screen.getByText('Savings Account')).toBeInTheDocument();
  });

  it('handles account disconnection', () => {
    // Mock the useConnectedAccounts hook with a disconnect function
    const mockDisconnect = vi.fn();
    vi.mock('@/hooks/useConnectedAccounts', () => ({
      useConnectedAccounts: () => ({
        accounts: [{ id: '1', name: 'Checking Account', balance: 1000 }],
        disconnect: mockDisconnect
      })
    }));

    render(
      <Provider store={mockStore}>
        <AccountConnections />
      </Provider>
    );

    const disconnectButton = screen.getByRole('button', { name: /disconnect/i });
    fireEvent.click(disconnectButton);

    expect(mockDisconnect).toHaveBeenCalledWith('1');
  });

  it('displays loading state while connecting', () => {
    // Mock the useConnectedAccounts hook with loading state
    vi.mock('@/hooks/useConnectedAccounts', () => ({
      useConnectedAccounts: () => ({
        accounts: [],
        isConnecting: true
      })
    }));

    render(
      <Provider store={mockStore}>
        <AccountConnections />
      </Provider>
    );

    expect(screen.getByText('Connecting...')).toBeInTheDocument();
  });

  it('displays error message when connection fails', () => {
    // Mock the useConnectedAccounts hook with error state
    vi.mock('@/hooks/useConnectedAccounts', () => ({
      useConnectedAccounts: () => ({
        accounts: [],
        error: 'Failed to connect to bank'
      })
    }));

    render(
      <Provider store={mockStore}>
        <AccountConnections />
      </Provider>
    );

    expect(screen.getByText('Failed to connect to bank')).toBeInTheDocument();
  });
}); 