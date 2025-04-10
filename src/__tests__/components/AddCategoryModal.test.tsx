import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, AnyAction } from '@reduxjs/toolkit';
import { AddCategoryModal } from '@/components/AddCategoryModal';
import { Category } from '@/types';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the hooks
vi.mock('@/hooks/useCurrency', () => ({
  useCurrency: () => ({
    currencyFormat: {
      currency: 'USD',
      placement: 'before',
      numberFormat: '123,456.78'
    },
    currencySymbol: '$'
  })
}));

interface BudgetState {
  categories: Category[];
  transactions: any[];
  currentMonth: string;
}

const initialState: BudgetState = {
  categories: [
    { id: '1', name: 'Food', budget: 1000 }
  ],
  transactions: [],
  currentMonth: new Date().toISOString().slice(0, 7)
};

describe('AddCategoryModal', () => {
  const mockOnClose = vi.fn();

  const mockStore = configureStore({
    reducer: {
      budget: (state: BudgetState = initialState) => state
    }
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the modal', () => {
    render(
      <Provider store={mockStore}>
        <AddCategoryModal onClose={mockOnClose} />
      </Provider>
    );

    expect(screen.getByText('Add New Category')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter category name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter budget amount')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add category/i })).toBeInTheDocument();
  });

  it('handles adding a new category', () => {
    const store = configureStore({
      reducer: {
        budget: (state: BudgetState = initialState, action: AnyAction): BudgetState => {
          if (action.type === 'budget/addCategory') {
            return {
              ...state,
              categories: [...state.categories, action.payload]
            };
          }
          return state;
        }
      }
    });

    render(
      <Provider store={store}>
        <AddCategoryModal onClose={mockOnClose} />
      </Provider>
    );

    // Fill in the form
    const nameInput = screen.getByPlaceholderText('Enter category name');
    const budgetInput = screen.getByPlaceholderText('Enter budget amount');

    fireEvent.change(nameInput, { target: { value: 'Entertainment' } });
    fireEvent.change(budgetInput, { target: { value: '500' } });

    // Submit the form
    const addButton = screen.getByRole('button', { name: /add category/i });
    fireEvent.click(addButton);

    // Check if the category was added
    const categories = store.getState().budget.categories;
    const newCategory = categories.find(c => c.name === 'Entertainment');
    expect(newCategory).toBeTruthy();
    expect(newCategory?.budget).toBe(500);

    // Check if the modal was closed
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('validates input before adding a category', () => {
    render(
      <Provider store={mockStore}>
        <AddCategoryModal onClose={mockOnClose} />
      </Provider>
    );

    // Try to submit with empty inputs
    const addButton = screen.getByRole('button', { name: /add category/i });
    fireEvent.click(addButton);

    // Verify modal wasn't closed (empty inputs)
    expect(mockOnClose).not.toHaveBeenCalled();

    // Fill in invalid budget
    const budgetInput = screen.getByPlaceholderText('Enter budget amount');
    fireEvent.change(budgetInput, { target: { value: '-100' } });

    // Submit with negative budget
    fireEvent.click(addButton);

    // Verify modal wasn't closed (invalid budget)
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('closes the modal when clicking the X button', () => {
    render(
      <Provider store={mockStore}>
        <AddCategoryModal onClose={mockOnClose} />
      </Provider>
    );

    const closeButton = screen.getByRole('button', { name: /close modal/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
}); 