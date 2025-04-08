import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import CategoryGroup from '@/components/CategoryList/CategoryGroup';
import { BudgetState, Category } from '@/types';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import budgetReducer, { getDefaultState } from '@/store/budgetSlice';

const mockCategories = [
  { id: '1', name: 'Food', budget: 1000, groupId: 'needs' },
  { id: '2', name: 'Rent', budget: 2000, groupId: 'bills' },
  { id: '3', name: 'Entertainment', budget: 500, groupId: 'wants' }
];

const initialState: BudgetState = {
  categories: mockCategories,
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
    dateFormat: 'MM/DD/YYYY'
  },
  balance: 1000,
  budgetName: '',
  categoryGroups: [
    { id: 'bills', name: 'Bills', isExpanded: true },
    { id: 'needs', name: 'Needs', isExpanded: true },
    { id: 'wants', name: 'Wants', isExpanded: true }
  ]
};

describe('CategoryGroup', () => {
  const mockStore = configureStore({
    reducer: {
      budget: (state: BudgetState = initialState, action: any) => {
        switch (action.type) {
          case 'budget/updateCategoryGroup':
            return {
              ...state,
              categoryGroups: state.categoryGroups.map(group =>
                group.id === action.payload.id ? { ...group, ...action.payload } : group
              )
            };
          case 'budget/addCategoryGroup':
            return {
              ...state,
              categoryGroups: [...state.categoryGroups, action.payload]
            };
          case 'budget/deleteCategoryGroup':
            return {
              ...state,
              categoryGroups: state.categoryGroups.filter(group => group.id !== action.payload)
            };
          case 'budget/updateCategory':
            return {
              ...state,
              categories: state.categories.map(category =>
                category.id === action.payload.id ? { ...category, ...action.payload } : category
              )
            };
          default:
            return state;
        }
      }
    },
    preloadedState: { budget: initialState }
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders category group with correct name', () => {
    render(
      <Provider store={mockStore}>
        <CategoryGroup groupId="bills" />
      </Provider>
    );

    expect(screen.getByText('Bills')).toBeInTheDocument();
  });

  it('displays categories belonging to the group', () => {
    render(
      <Provider store={mockStore}>
        <CategoryGroup groupId="bills" />
      </Provider>
    );

    expect(screen.getByText('Rent')).toBeInTheDocument();
  });

  it('toggles group expansion when clicking the expand/collapse button', () => {
    render(
      <Provider store={mockStore}>
        <CategoryGroup groupId="bills" />
      </Provider>
    );

    const toggleButton = screen.getByLabelText('Toggle group');
    fireEvent.click(toggleButton);

    const updatedState = mockStore.getState().budget;
    const billsGroup = updatedState.categoryGroups.find(g => g.id === 'bills');
    expect(billsGroup?.isExpanded).toBe(false);
  });

  it('allows editing group name', () => {
    render(
      <Provider store={mockStore}>
        <CategoryGroup groupId="bills" />
      </Provider>
    );

    const editButton = screen.getByLabelText('Edit group');
    fireEvent.click(editButton);

    const nameInput = screen.getByDisplayValue('Bills');
    fireEvent.change(nameInput, { target: { value: 'Monthly Bills' } });
    fireEvent.blur(nameInput);

    const updatedState = mockStore.getState().budget;
    const billsGroup = updatedState.categoryGroups.find(g => g.id === 'bills');
    expect(billsGroup?.name).toBe('Monthly Bills');
  });

  it('allows deleting group', () => {
    render(
      <Provider store={mockStore}>
        <CategoryGroup groupId="bills" />
      </Provider>
    );

    const deleteButton = screen.getByLabelText('Delete group');
    fireEvent.click(deleteButton);

    // Should show confirmation dialog
    const confirmButton = screen.getByText('Confirm Delete');
    fireEvent.click(confirmButton);

    const updatedState = mockStore.getState().budget;
    expect(updatedState.categoryGroups.find(g => g.id === 'bills')).toBeUndefined();
  });

  it('handles drag and drop of categories between groups', () => {
    const mockStore = configureStore({
      reducer: {
        budget: budgetReducer
      },
      preloadedState: {
        budget: {
          ...getDefaultState(),
          categories: [
            { id: '1', name: 'Food', budget: 1000, spent: 0, groupId: 'needs' }
          ],
          categoryGroups: [
            { id: 'needs', name: 'Needs', isExpanded: true },
            { id: 'bills', name: 'Bills', isExpanded: true }
          ]
        }
      }
    });

    render(
      <Provider store={mockStore}>
        <div>
          <CategoryGroup groupId="needs" />
          <CategoryGroup groupId="bills" />
        </div>
      </Provider>
    );

    const foodCategory = screen.getByText('Food').closest('tr');
    const billsGroup = screen.getByText('Bills').closest('div[role="group"]');

    if (foodCategory && billsGroup) {
      fireEvent.dragStart(foodCategory);
      fireEvent.drop(billsGroup);
      fireEvent.dragEnd(foodCategory);

      const updatedState = mockStore.getState().budget as BudgetState;
      const movedCategory = updatedState.categories.find((c: Category) => c.id === '1');
      expect(movedCategory?.groupId).toBe('bills');
    }
  });
}); 