import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Accounts from '../../components/Accounts';
import accountReducer from '../../store/accountSlice';
import { Account } from '../../types/account';

const mockAccounts: Account[] = [
  {
    id: '1',
    name: 'Main Checking',
    type: 'checking',
    balance: 2000,
    institutionName: 'Chase',
    userId: 'user1',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Savings',
    type: 'savings',
    balance: 5000,
    institutionName: 'Chase',
    userId: 'user1',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: 'test-user' }
  })
}));

const renderWithProvider = (component: React.ReactElement) => {
  const store = configureStore({
    reducer: {
      accounts: accountReducer,
    },
    preloadedState: {
      accounts: {
        accounts: mockAccounts,
        transactions: [],
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

describe('Accounts Component', () => {
  it('renders account list correctly', () => {
    renderWithProvider(<Accounts />);
    
    expect(screen.getByText('Main Checking')).toBeInTheDocument();
    expect(screen.getByText('Savings')).toBeInTheDocument();
    expect(screen.getByText('$2,000.00')).toBeInTheDocument();
    expect(screen.getByText('$5,000.00')).toBeInTheDocument();
  });

  it('filters accounts by type', () => {
    renderWithProvider(<Accounts />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'checking' } });
    
    expect(screen.getByText('Main Checking')).toBeInTheDocument();
    expect(screen.queryByText('Savings')).not.toBeInTheDocument();
  });

  it('shows total balance correctly', () => {
    renderWithProvider(<Accounts />);
    
    expect(screen.getByText('$7,000.00')).toBeInTheDocument();
  });

  it('navigates to account transactions when clicking an account', () => {
    renderWithProvider(<Accounts />);
    
    const accountCard = screen.getByText('Main Checking').closest('div[class*="bg-white"]');
    fireEvent.click(accountCard!);
    
    expect(screen.getByText('Cleared Balance')).toBeInTheDocument();
    expect(screen.getByText('Uncleared Balance')).toBeInTheDocument();
    expect(screen.getByText('Working Balance')).toBeInTheDocument();
  });

  it('returns to account list when clicking back button', () => {
    renderWithProvider(<Accounts />);
    
    // Navigate to transactions
    const accountCard = screen.getByText('Main Checking').closest('div[class*="bg-white"]');
    fireEvent.click(accountCard!);
    
    // Click back button
    const backButton = screen.getByRole('button');
    fireEvent.click(backButton);
    
    // Verify we're back to the accounts list
    expect(screen.getByText('Main Checking')).toBeInTheDocument();
    expect(screen.getByText('Savings')).toBeInTheDocument();
  });

  it('deletes account when confirmed', async () => {
    const mockConfirm = jest.spyOn(window, 'confirm');
    mockConfirm.mockImplementation(() => true);
    
    renderWithProvider(<Accounts />);
    
    const deleteButton = screen.getAllByRole('button')[1]; // First delete button
    fireEvent.click(deleteButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Main Checking')).not.toBeInTheDocument();
    });
    
    mockConfirm.mockRestore();
  });
}); 
 
 
 
 
 
 