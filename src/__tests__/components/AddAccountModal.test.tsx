import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import AddAccountModal from '../../components/Accounts/AddAccountModal';
import accountReducer from '../../store/accountSlice';

const mockOnClose = jest.fn();

const renderWithProvider = (component: React.ReactElement) => {
  const store = configureStore({
    reducer: {
      accounts: accountReducer,
    },
  });

  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('AddAccountModal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal correctly when open', () => {
    renderWithProvider(<AddAccountModal isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText('Add New Account')).toBeInTheDocument();
    expect(screen.getByLabelText('Account Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Account Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Starting Balance')).toBeInTheDocument();
    expect(screen.getByLabelText('Institution Name (Optional)')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    renderWithProvider(<AddAccountModal isOpen={false} onClose={mockOnClose} />);
    
    expect(screen.queryByText('Add New Account')).not.toBeInTheDocument();
  });

  it('closes when clicking the close button', () => {
    renderWithProvider(<AddAccountModal isOpen={true} onClose={mockOnClose} />);
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('submits form with correct data', async () => {
    renderWithProvider(<AddAccountModal isOpen={true} onClose={mockOnClose} />);
    
    fireEvent.change(screen.getByLabelText('Account Name'), {
      target: { value: 'Test Account' },
    });
    
    fireEvent.change(screen.getByLabelText('Account Type'), {
      target: { value: 'savings' },
    });
    
    fireEvent.change(screen.getByLabelText('Starting Balance'), {
      target: { value: '1000' },
    });
    
    fireEvent.change(screen.getByLabelText('Institution Name (Optional)'), {
      target: { value: 'Test Bank' },
    });
    
    const submitButton = screen.getByRole('button', { name: /add account/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('validates required fields', () => {
    renderWithProvider(<AddAccountModal isOpen={true} onClose={mockOnClose} />);
    
    const submitButton = screen.getByRole('button', { name: /add account/i });
    fireEvent.click(submitButton);
    
    expect(screen.getByLabelText('Account Name')).toBeInvalid();
    expect(screen.getByLabelText('Starting Balance')).toBeInvalid();
  });
}); 