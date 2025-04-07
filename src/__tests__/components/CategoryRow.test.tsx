import { render, fireEvent, screen } from '@testing-library/react';
import { CategoryRow } from '@/components/CategoryList/CategoryRow';
import { Category, CurrencyFormat } from '@/types';

describe('CategoryRow', () => {
  const mockCategory: Category = {
    id: '1',
    name: 'Food',
    budget: 1000
  };

  const mockCurrencyFormat: CurrencyFormat = {
    currency: 'USD',
    placement: 'before' as const,
    numberFormat: {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  };

  const mockProps = {
    category: mockCategory,
    isEditing: false,
    editingName: '',
    editingBudget: '',
    menuOpenId: null,
    currencyFormat: mockCurrencyFormat,
    currencySymbol: '$',
    activity: 500,
    remaining: 500,
    percentUsed: 50,
    progressClass: 'bg-green-500',
    textColorClass: 'text-green-600',
    onDragStart: jest.fn(),
    onDragEnd: jest.fn(),
    onDragOver: jest.fn(),
    onDrop: jest.fn(),
    onEditingNameChange: jest.fn(),
    onEditingBudgetChange: jest.fn(),
    onUpdate: jest.fn(),
    onCancelEdit: jest.fn(),
    onDelete: jest.fn()
  };

  it('should render category name and budget', () => {
    render(<CategoryRow {...mockProps} />);
    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText('$1,000')).toBeInTheDocument();
  });

  it('should render activity and remaining amounts', () => {
    render(<CategoryRow {...mockProps} />);
    expect(screen.getByText('$500')).toBeInTheDocument();
  });

  it('should show edit inputs when isEditing is true', () => {
    render(
      <CategoryRow
        {...mockProps}
        isEditing={true}
        editingName="Food"
        editingBudget="1000"
      />
    );
    
    const nameInput = screen.getByDisplayValue('Food');
    const budgetInput = screen.getByDisplayValue('1000');
    
    expect(nameInput).toBeInTheDocument();
    expect(budgetInput).toBeInTheDocument();
  });

  it('should call onEditingNameChange when name input changes', () => {
    render(
      <CategoryRow
        {...mockProps}
        isEditing={true}
        editingName="Food"
        editingBudget="1000"
      />
    );
    
    const nameInput = screen.getByDisplayValue('Food');
    fireEvent.change(nameInput, { target: { value: 'New Food' } });
    
    expect(mockProps.onEditingNameChange).toHaveBeenCalledWith('New Food');
  });

  it('should call onEditingBudgetChange when budget input changes', () => {
    render(
      <CategoryRow
        {...mockProps}
        isEditing={true}
        editingName="Food"
        editingBudget="1000"
      />
    );
    
    const budgetInput = screen.getByDisplayValue('1000');
    fireEvent.change(budgetInput, { target: { value: '2000' } });
    
    expect(mockProps.onEditingBudgetChange).toHaveBeenCalledWith('2000');
  });

  it('should call onUpdate when clicking save button while editing', () => {
    render(
      <CategoryRow
        {...mockProps}
        isEditing={true}
        editingName="Food"
        editingBudget="1000"
      />
    );
    
    const saveButton = screen.getByLabelText('Save');
    fireEvent.click(saveButton);
    
    expect(mockProps.onUpdate).toHaveBeenCalled();
  });

  it('should call onCancelEdit when clicking cancel button while editing', () => {
    render(
      <CategoryRow
        {...mockProps}
        isEditing={true}
        editingName="Food"
        editingBudget="1000"
      />
    );
    
    const cancelButton = screen.getByLabelText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(mockProps.onCancelEdit).toHaveBeenCalled();
  });

  it('should call onDelete when clicking delete button', () => {
    render(<CategoryRow {...mockProps} />);
    
    const deleteButton = screen.getByLabelText('Delete');
    fireEvent.click(deleteButton);
    
    expect(mockProps.onDelete).toHaveBeenCalled();
  });

  it('should handle drag and drop events', () => {
    render(<CategoryRow {...mockProps} />);
    const row = screen.getByRole('row');
    
    fireEvent.dragStart(row);
    expect(mockProps.onDragStart).toHaveBeenCalled();
    
    fireEvent.dragEnd(row);
    expect(mockProps.onDragEnd).toHaveBeenCalled();
    
    fireEvent.dragOver(row);
    expect(mockProps.onDragOver).toHaveBeenCalled();
    
    fireEvent.drop(row);
    expect(mockProps.onDrop).toHaveBeenCalled();
  });
}); 