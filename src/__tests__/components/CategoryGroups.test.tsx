import React from 'react';
import { render, screen, fireEvent, createEvent, within, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import budgetReducer from '@/store/budgetSlice';
import CategoryGroups from '@/components/CategoryGroups';
import { Category, CategoryGroup, BudgetState, CurrencyFormat } from '@/types';

describe('CategoryGroups', () => {
  const mockCategories: Category[] = [
    {
      id: '1',
      name: 'Groceries',
      budget: 500,
      groupId: '1',
      userId: 'user1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Rent',
      budget: 1000,
      groupId: '1',
      userId: 'user1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const mockGroups: CategoryGroup[] = [
    {
      id: '1',
      name: 'Needs',
      userId: 'user1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isCollapsed: false
    },
    {
      id: '2',
      name: 'Wants',
      userId: 'user1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isCollapsed: false
    }
  ];

  const mockCurrencyFormat: CurrencyFormat = {
    currency: 'USD',
    locale: 'en-US',
    placement: 'before',
    numberFormat: {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    },
    dateFormat: 'MM/DD/YYYY'
  };

  const initialState: BudgetState = {
    categories: mockCategories,
    categoryGroups: mockGroups,
    transactions: [],
    currentMonth: new Date().toISOString(),
    globalCurrency: 'USD',
    currencyFormat: mockCurrencyFormat,
    balance: 0,
    budgetName: 'My Budget'
  };

  const renderWithProvider = (component: React.ReactNode) => {
    const store = configureStore({
      reducer: {
        budget: budgetReducer
      },
      preloadedState: {
        budget: initialState
      }
    });

    return render(
      <Provider store={store}>
        {component}
      </Provider>
    );
  };

  it('renders category groups with their categories', () => {
    renderWithProvider(<CategoryGroups />);
    
    // Check if groups are rendered
    expect(screen.getByText('Needs')).toBeInTheDocument();
    expect(screen.getByText('Wants')).toBeInTheDocument();

    // Check if categories are rendered in correct groups
    expect(screen.getByText('Rent')).toBeInTheDocument();
    expect(screen.getByText('Groceries')).toBeInTheDocument();
  });

  it('allows collapsing and expanding groups', async () => {
    renderWithProvider(<CategoryGroups />);
    
    const needsGroup = screen.getByText('Needs').closest('div[class*="bg-white"]') as HTMLElement;
    const tableContainer = within(needsGroup).getByRole('table').closest('div') as HTMLElement;
    expect(tableContainer).toBeInTheDocument();
    
    // Click to collapse
    const collapseButton = within(needsGroup).getByRole('button', { name: '' });
    fireEvent.click(collapseButton);
    
    // Table container should be removed
    await waitFor(() => {
      expect(within(needsGroup).queryByRole('table')).not.toBeInTheDocument();
    });
    
    // Click to expand
    fireEvent.click(collapseButton);
    
    // Table container should be back
    await waitFor(() => {
      expect(within(needsGroup).getByRole('table')).toBeInTheDocument();
    });
  });

  it('allows adding a new category group', async () => {
    renderWithProvider(<CategoryGroups />);
    
    // Click add group button
    const addButton = screen.getByText('Add Group');
    fireEvent.click(addButton);
    
    // Fill in the form
    const nameInput = screen.getByPlaceholderText('Enter group name');
    fireEvent.change(nameInput, { target: { value: 'Savings' } });
    
    // Submit the form
    const submitButton = screen.getByText('Add');
    fireEvent.click(submitButton);
    
    // New group should be visible
    expect(screen.getByText('Savings')).toBeInTheDocument();
  });

  it('allows editing a category group name', async () => {
    renderWithProvider(<CategoryGroups />);
    
    const needsGroup = screen.getByText('Needs').closest('div[class*="bg-white"]') as HTMLElement;
    const editButton = within(needsGroup).getByRole('button', { name: 'Edit group' });
    fireEvent.click(editButton);
    
    const nameInput = screen.getByRole('textbox');
    fireEvent.change(nameInput, { target: { value: 'Updated Needs' } });
    
    const saveButton = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText('Updated Needs')).toBeInTheDocument();
    });
  });

  it('allows deleting a category group', async () => {
    renderWithProvider(<CategoryGroups />);
    
    const needsGroup = screen.getByText('Needs').closest('div[class*="bg-white"]') as HTMLElement;
    const deleteButton = within(needsGroup).getByRole('button', { name: 'Delete group' });
    fireEvent.click(deleteButton);
    
    const confirmButton = screen.getByRole('button', { name: 'Delete' });
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Needs')).not.toBeInTheDocument();
    });
  });

  it('allows dragging categories between groups', async () => {
    renderWithProvider(<CategoryGroups />);
    
    const groceriesRow = screen.getByText('Groceries').closest('tr') as HTMLElement;
    const wantsGroup = screen.getByText('Wants').closest('div[class*="bg-white"]') as HTMLElement;

    const dragStartEvent = createEvent.dragStart(groceriesRow, {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(dragStartEvent, 'dataTransfer', {
      value: {
        setData: () => {},
        getData: () => '1', // Category ID
      },
    });

    const dragOverEvent = createEvent.dragOver(wantsGroup, {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(dragOverEvent, 'dataTransfer', {
      value: {
        setData: () => {},
        getData: () => '1', // Category ID
      },
    });

    const dropEvent = createEvent.drop(wantsGroup, {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(dropEvent, 'dataTransfer', {
      value: {
        setData: () => {},
        getData: () => '1', // Category ID
      },
    });

    fireEvent(groceriesRow, dragStartEvent);
    fireEvent(wantsGroup, dragOverEvent);
    fireEvent(wantsGroup, dropEvent);

    await waitFor(() => {
      const wantsCategories = within(wantsGroup).getAllByText('Groceries');
      expect(wantsCategories).toHaveLength(1);
    });
  });
}); 