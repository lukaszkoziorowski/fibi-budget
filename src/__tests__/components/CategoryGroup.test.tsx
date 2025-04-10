import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { CategoryGroupComponent } from '@/components/CategoryList/CategoryGroup';
import type { CategoryGroup, Category, BudgetState } from '@/types';
import budgetReducer from '@/store/budgetSlice';

// Mock the hooks
jest.mock('@/hooks/useCurrency', () => ({
  useCurrency: () => ({
    currencyFormat: { currency: 'USD' },
    currencySymbol: '$'
  })
}));

// Create a mock store
const createMockStore = (initialState: Partial<BudgetState> = {}) => {
  return configureStore({
    reducer: {
      budget: budgetReducer
    },
    preloadedState: {
      budget: {
        categories: [],
        categoryGroups: [],
        transactions: [],
        currentMonth: '2024-03',
        globalCurrency: 'USD',
        currencyFormat: {
          currency: 'USD',
          locale: 'en-US',
          placement: 'before' as const,
          numberFormat: {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          },
          dateFormat: 'MM/DD/YYYY'
        },
        balance: 0,
        budgetName: 'Test Budget',
        ...initialState
      }
    }
  });
};

describe('CategoryGroup', () => {
  const mockGroup: CategoryGroup = {
    id: '1',
    name: 'Test Group',
    userId: 'user1',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-01',
    isCollapsed: false
  };

  const mockCategories: Category[] = [
    {
      id: '1',
      name: 'Category 1',
      budget: 100,
      groupId: '1',
      userId: 'user1',
      createdAt: '2024-03-01',
      updatedAt: '2024-03-01'
    }
  ];

  it('renders group name and toggle button', () => {
    const store = createMockStore({
      categoryGroups: [mockGroup],
      categories: mockCategories
    });

    render(
      <Provider store={store}>
        <CategoryGroupComponent groupId={mockGroup.id} />
      </Provider>
    );

    expect(screen.getByText('Test Group')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Toggle group' })).toBeInTheDocument();
  });

  it('toggles collapse state when clicking the button', () => {
    const store = createMockStore({
      categoryGroups: [mockGroup],
      categories: mockCategories
    });

    render(
      <Provider store={store}>
        <CategoryGroupComponent groupId={mockGroup.id} />
      </Provider>
    );

    const toggleButton = screen.getByRole('button', { name: 'Toggle group' });
    fireEvent.click(toggleButton);

    const state = store.getState();
    expect(state.budget.categoryGroups[0].isCollapsed).toBe(true);
  });

  it('shows categories when not collapsed', () => {
    const store = createMockStore({
      categoryGroups: [mockGroup],
      categories: mockCategories
    });

    render(
      <Provider store={store}>
        <CategoryGroupComponent groupId={mockGroup.id} />
      </Provider>
    );

    expect(screen.getByText('Category 1')).toBeInTheDocument();
  });

  it('hides categories when collapsed', () => {
    const collapsedGroup = { ...mockGroup, isCollapsed: true };
    const store = createMockStore({
      categoryGroups: [collapsedGroup],
      categories: mockCategories
    });

    render(
      <Provider store={store}>
        <CategoryGroupComponent groupId={collapsedGroup.id} />
      </Provider>
    );

    expect(screen.queryByText('Category 1')).not.toBeInTheDocument();
  });
});