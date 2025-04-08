import { render, screen, fireEvent, createEvent, within, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import budgetReducer, { addCategoryGroup, updateCategoryGroup, deleteCategoryGroup, moveCategoryToGroup } from '@/store/budgetSlice';
import CategoryGroups from '@/components/CategoryGroups';
import { vi } from 'vitest';

describe('CategoryGroups', () => {
  const initialState = {
    budget: {
      budgetName: 'Test Budget',
      categories: [
        { id: '1', name: 'Groceries', budget: 500, groupId: 'needs' },
        { id: '2', name: 'Entertainment', budget: 200, groupId: 'wants' },
        { id: '3', name: 'Rent', budget: 1000, groupId: 'bills' }
      ],
      categoryGroups: [
        { id: 'bills', name: 'Bills', isCollapsed: false },
        { id: 'needs', name: 'Needs', isCollapsed: false },
        { id: 'wants', name: 'Wants', isCollapsed: false }
      ],
      transactions: [],
      currentMonth: new Date().toISOString(),
      globalCurrency: 'USD',
      currencyFormat: {
        currency: 'USD',
        locale: 'en-US',
        placement: 'before' as const,
        dateFormat: 'MM/DD/YYYY',
        numberFormat: {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
          useGrouping: true
        }
      },
      balance: 0
    }
  };

  const renderWithProvider = (component: React.ReactNode) => {
    const store = configureStore({
      reducer: {
        budget: budgetReducer
      },
      preloadedState: initialState
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
    expect(screen.getByText('Bills')).toBeInTheDocument();
    expect(screen.getByText('Needs')).toBeInTheDocument();
    expect(screen.getByText('Wants')).toBeInTheDocument();

    // Check if categories are rendered in correct groups
    expect(screen.getByText('Rent')).toBeInTheDocument();
    expect(screen.getByText('Groceries')).toBeInTheDocument();
    expect(screen.getByText('Entertainment')).toBeInTheDocument();
  });

  it('allows collapsing and expanding groups', async () => {
    renderWithProvider(<CategoryGroups />);
    
    const billsGroup = screen.getByText('Bills').closest('div[class*="bg-white"]') as HTMLElement;
    const tableContainer = within(billsGroup).getByRole('table').closest('div') as HTMLElement;
    expect(tableContainer).toBeInTheDocument();
    
    // Click to collapse
    const collapseButton = within(billsGroup).getByRole('button', { name: '' });
    fireEvent.click(collapseButton);
    
    // Table container should be removed
    await waitFor(() => {
      expect(within(billsGroup).queryByRole('table')).not.toBeInTheDocument();
    });
    
    // Click to expand
    fireEvent.click(collapseButton);
    
    // Table container should be back
    await waitFor(() => {
      expect(within(billsGroup).getByRole('table')).toBeInTheDocument();
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
    
    const billsGroup = screen.getByText('Bills').closest('div[class*="bg-white"]') as HTMLElement;
    const editButton = within(billsGroup).getByRole('button', { name: 'Edit group' });
    fireEvent.click(editButton);
    
    const nameInput = screen.getByRole('textbox');
    fireEvent.change(nameInput, { target: { value: 'Updated Bills' } });
    
    const saveButton = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText('Updated Bills')).toBeInTheDocument();
    });
  });

  it('allows deleting a category group', async () => {
    renderWithProvider(<CategoryGroups />);
    
    const billsGroup = screen.getByText('Bills').closest('div[class*="bg-white"]') as HTMLElement;
    const deleteButton = within(billsGroup).getByRole('button', { name: 'Delete group' });
    fireEvent.click(deleteButton);
    
    const confirmButton = screen.getByRole('button', { name: 'Delete' });
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Bills')).not.toBeInTheDocument();
    });
  });

  it('allows dragging categories between groups', async () => {
    renderWithProvider(<CategoryGroups />);
    
    const groceriesRow = screen.getByText('Groceries').closest('tr');
    const wantsGroup = screen.getByText('Wants').closest('div');

    const dragStartEvent = createEvent.dragStart(groceriesRow!, {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(dragStartEvent, 'dataTransfer', {
      value: {
        setData: () => {},
        getData: () => 'groceries',
      },
    });

    const dragOverEvent = createEvent.dragOver(wantsGroup!, {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(dragOverEvent, 'dataTransfer', {
      value: {
        setData: () => {},
        getData: () => 'groceries',
      },
    });

    const dropEvent = createEvent.drop(wantsGroup!, {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(dropEvent, 'dataTransfer', {
      value: {
        setData: () => {},
        getData: () => 'groceries',
      },
    });

    fireEvent(groceriesRow!, dragStartEvent);
    fireEvent(wantsGroup!, dragOverEvent);
    fireEvent(wantsGroup!, dropEvent);

    await waitFor(() => {
      const wantsCategories = screen.getAllByText('Groceries');
      expect(wantsCategories).toHaveLength(1);
    });
  });
}); 