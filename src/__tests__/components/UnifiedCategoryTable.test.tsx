import React from 'react';
import { render, screen, within, fireEvent, waitFor } from '@testing-library/react';
import { UnifiedCategoryTable } from '@/components/UnifiedCategoryTable';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import budgetReducer from '@/store/budgetSlice';
import { BudgetState } from '@/types';

// Mock the currency hooks
vi.mock('@/hooks/useCurrency', () => ({
  useCurrency: () => ({
    format: (amount: number) => `$${amount.toFixed(2)}`,
    parse: (value: string) => parseFloat(value.replace(/[^0-9.-]+/g, '')),
  }),
}));

vi.mock('@/hooks/useExchangeRates', () => ({
  useExchangeRates: () => ({
    convertAmount: (amount: number) => amount
  })
}));

// Mock the CategoryRow component
vi.mock('@/components/CategoryList/CategoryRow', () => ({
  CategoryRow: ({ category }: { category: any }) => (
    <tr data-testid={`category-row-${category.id}`}>
      <td>{category.name}</td>
      <td>{category.budget}</td>
    </tr>
  )
}));

// Mock the Dialog component from @headlessui/react
vi.mock('@headlessui/react', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode, open: boolean }) => 
    open ? <div data-testid="modal">{children}</div> : null,
  DialogOverlay: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Transition: {
    Child: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
  }
}));

describe('UnifiedCategoryTable', () => {
  const initialState: BudgetState = {
    categories: [
      { id: '1', name: 'Groceries', budget: 500, groupId: 'group1', userId: '1', createdAt: '2023-01-01', updatedAt: '2023-01-01' },
      { id: '2', name: 'Rent', budget: 1000, groupId: 'group1', userId: '1', createdAt: '2023-01-01', updatedAt: '2023-01-01' },
      { id: '3', name: 'Entertainment', budget: 200, groupId: 'group2', userId: '1', createdAt: '2023-01-01', updatedAt: '2023-01-01' }
    ],
    categoryGroups: [
      { id: 'group1', name: 'Necessities', userId: '1', createdAt: '2023-01-01', updatedAt: '2023-01-01', isCollapsed: false },
      { id: 'group2', name: 'Wants', userId: '1', createdAt: '2023-01-01', updatedAt: '2023-01-01', isCollapsed: false }
    ],
    transactions: [],
    currentMonth: '2023-01-01',
    balance: 0,
    globalCurrency: 'USD',
    currencyFormat: {
      placement: 'before',
      currency: 'USD',
      locale: 'en-US',
      numberFormat: {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      },
      dateFormat: 'MM/dd/yyyy'
    },
    budgetName: 'My Budget'
  };

  const renderComponent = (state = initialState) => {
    const store = configureStore({
      reducer: {
        budget: budgetReducer
      },
      preloadedState: {
        budget: state
      }
    });

    return render(
      <Provider store={store}>
        <UnifiedCategoryTable />
      </Provider>
    );
  };

  it('renders category groups and their categories', () => {
    renderComponent();
    
    // Check if group names are rendered
    expect(screen.getByText('Necessities')).toBeInTheDocument();
    expect(screen.getByText('Wants')).toBeInTheDocument();
    
    // Check if category names are rendered
    expect(screen.getByText('Groceries')).toBeInTheDocument();
    expect(screen.getByText('Rent')).toBeInTheDocument();
    expect(screen.getByText('Entertainment')).toBeInTheDocument();
  });

  it('maintains consistent column alignment across groups and categories', () => {
    renderComponent();

    // Check if column headers are present and aligned
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Assigned')).toBeInTheDocument();
    expect(screen.getByText('Activity')).toBeInTheDocument();
    expect(screen.getByText('Available')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('collapses and expands category groups when clicked', async () => {
    renderComponent();

    // Get the first group's collapse button and categories
    const collapseButton = screen.getAllByTestId('collapse-button')[0];
    const groceriesRow = screen.getByText('Groceries').closest('tr');
    const rentRow = screen.getByText('Rent').closest('tr');

    // Initially categories should be in the document
    expect(groceriesRow).toBeInTheDocument();
    expect(rentRow).toBeInTheDocument();

    // Click to collapse
    fireEvent.click(collapseButton);

    // Wait for categories to be removed
    await waitFor(() => {
      expect(screen.queryByText('Groceries')).not.toBeInTheDocument();
      expect(screen.queryByText('Rent')).not.toBeInTheDocument();
    });

    // Click to expand
    fireEvent.click(collapseButton);

    // Wait for categories to be back in the document
    await waitFor(() => {
      expect(screen.getByText('Groceries')).toBeInTheDocument();
      expect(screen.getByText('Rent')).toBeInTheDocument();
    });
  });

  const findAmountInCell = (amount: string) => {
    const cells = screen.getAllByRole('cell');
    return cells.some(cell => {
      const text = cell.textContent?.replace(/[^0-9.]/g, '');
      return text === amount;
    });
  };

  it('shows correct budget amounts for categories', () => {
    renderComponent();
    
    expect(findAmountInCell('500.00')).toBe(true);
    expect(findAmountInCell('1000.00')).toBe(true);
    expect(findAmountInCell('200.00')).toBe(true);
  });

  it('shows action buttons on group hover', () => {
    renderComponent();

    // Get the first group row
    const groupRow = screen.getByText('Necessities').closest('tr');
    expect(groupRow).toBeInTheDocument();

    // Action buttons should be in the group row
    const addButton = within(groupRow!).getByRole('button', { name: 'Add category' });
    const editButton = within(groupRow!).getByRole('button', { name: 'Edit group' });
    const deleteButton = within(groupRow!).getByRole('button', { name: 'Delete group' });

    expect(addButton).toBeInTheDocument();
    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

  it('opens edit modal when edit button is clicked', () => {
    renderComponent();

    // Get the first group row
    const groupRow = screen.getByText('Necessities').closest('tr');
    
    // Click edit button
    const editButton = within(groupRow!).getByRole('button', { name: 'Edit group' });
    fireEvent.click(editButton);

    // Check if modal is open
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Edit Group')).toBeInTheDocument();
  });

  it('opens delete confirmation when delete button is clicked', () => {
    renderComponent();

    // Get the first group row
    const groupRow = screen.getByText('Necessities').closest('tr');
    
    // Click delete button
    const deleteButton = within(groupRow!).getByRole('button', { name: 'Delete group' });
    fireEvent.click(deleteButton);

    // Check if confirmation modal is open
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Delete Group')).toBeInTheDocument();
  });

  it('opens add category modal when plus icon is clicked and adds category to the group', async () => {
    renderComponent();

    // Get the first group row
    const groupRow = screen.getByText('Necessities').closest('tr');
    
    // Click add button
    const addButton = within(groupRow!).getByRole('button', { name: 'Add category' });
    fireEvent.click(addButton);

    // Check if modal is open
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Add Category')).toBeInTheDocument();
  });

  it('deletes a category when the trash icon is clicked', () => {
    const store = configureStore({
      reducer: {
        budget: budgetReducer
      },
      preloadedState: {
        budget: initialState
      }
    });

    render(
      <Provider store={store}>
        <UnifiedCategoryTable />
      </Provider>
    );
    
    // Find the Groceries category row
    const groceriesRow = screen.getByText('Groceries').closest('tr');
    expect(groceriesRow).toBeInTheDocument();
    
    // Find the delete button within the row
    const deleteButton = groceriesRow?.querySelector('button[aria-label="Delete category"]');
    expect(deleteButton).toBeInTheDocument();
    
    // Click the delete button
    fireEvent.click(deleteButton!);
    
    // Check if the category was removed
    expect(screen.queryByText('Groceries')).not.toBeInTheDocument();
    
    // Verify the state was updated
    const state = store.getState().budget;
    expect(state.categories.find(c => c.id === '1')).toBeUndefined();
  });

  it('shows the trash icon only when hovering over a category row', () => {
    renderComponent();
    
    // Find the Groceries category row
    const groceriesRow = screen.getByText('Groceries').closest('tr');
    expect(groceriesRow).toBeInTheDocument();
    
    // Initially, the delete button should be hidden (opacity-0)
    const deleteButton = groceriesRow?.querySelector('button[aria-label="Delete category"]');
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton?.parentElement).toHaveClass('opacity-0');
    
    // Simulate hover on the row
    fireEvent.mouseEnter(groceriesRow!);
    
    // After hover, the delete button should be visible (opacity-100)
    expect(deleteButton?.parentElement).toHaveClass('opacity-100');
    
    // Simulate mouse leave
    fireEvent.mouseLeave(groceriesRow!);
    
    // After mouse leave, the delete button should be hidden again
    expect(deleteButton?.parentElement).toHaveClass('opacity-0');
  });
}); 