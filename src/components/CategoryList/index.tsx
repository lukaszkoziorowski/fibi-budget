import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { deleteCategory, updateCategory, reorderCategories } from '@/store/budgetSlice';
import { useCurrency } from '@/hooks/useCurrency';
import { useExchangeRates } from '@/hooks/useExchangeRates';
import { calculateCategoryActivity, validateCategoryOperation } from '@/utils/categoryUtils';
import { useBudgetStats } from '@/hooks/useBudgetStats';
import { CategoryRow } from './CategoryRow';
import { Category } from '@/types';


const CategoryList = () => {
  const dispatch = useDispatch();
  const { categories, transactions, currentMonth } = useSelector((state: RootState) => state.budget);
  const { currencyFormat, currencySymbol } = useCurrency();
  const { convertAmount } = useExchangeRates(transactions, currencyFormat.currency);
  useBudgetStats();
  
  // State management
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingBudget, setEditingBudget] = useState('');
  const [menuOpenId] = useState<string | null>(null);
  const [draggedCategoryId, setDraggedCategoryId] = useState<string | null>(null);

  // Category operations
  const handleUpdateCategory = useCallback((id: string) => {
    if (!validateCategoryOperation.canUpdate(editingName, editingBudget)) return;
    
    const category = categories.find((c) => c.id === id);
    if (!category) return;
    
    dispatch(updateCategory({
      id,
      name: editingName.trim(),
      budget: Number(editingBudget) || category.budget,
    }));
    resetEditingState();
  }, [categories, dispatch, editingBudget, editingName]);

  const handleRemoveCategory = useCallback((id: string) => {
    if (!validateCategoryOperation.canDelete(id, transactions)) {
      alert('Cannot delete a category that has transactions assigned to it.');
      return;
    }
    dispatch(deleteCategory(id));
  }, [dispatch, transactions]);


  // Drag and drop handlers
  const handleDragStart = useCallback((e: React.DragEvent, categoryId: string) => {
    setDraggedCategoryId(categoryId);
    e.dataTransfer.effectAllowed = 'move';
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.add('opacity-50');
    }
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    setDraggedCategoryId(null);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.remove('opacity-50');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetCategoryId: string) => {
    e.preventDefault();
    if (!draggedCategoryId || draggedCategoryId === targetCategoryId) return;
    
    const draggedIndex = categories.findIndex(c => c.id === draggedCategoryId);
    const targetIndex = categories.findIndex(c => c.id === targetCategoryId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    const newCategories = [...categories];
    const [movedCategory] = newCategories.splice(draggedIndex, 1);
    newCategories.splice(targetIndex, 0, movedCategory);
    
    dispatch(reorderCategories(newCategories));
  }, [categories, dispatch, draggedCategoryId]);

  // Helper functions
  const resetEditingState = useCallback(() => {
    setEditingId(null);
    setEditingName('');
    setEditingBudget('');
  }, []);

  // UI Event Handlers

  // Category calculations
  const getCategoryDetails = useCallback((category: Category) => {
    const activity = calculateCategoryActivity(
      category.id,
      transactions,
      currentMonth,
      convertAmount
    );
    const remaining = category.budget - activity;
    const percentUsed = category.budget > 0 ? Math.min((activity / category.budget) * 100, 100) : 0;

    return {
      activity,
      remaining,
      percentUsed,
      progressClass: getProgressClass(remaining, category.budget),
      textColorClass: getTextColorClass(remaining, category.budget)
    };
  }, [transactions, currentMonth, convertAmount]);

  // Style helpers
  const getProgressClass = useCallback((remaining: number, budget: number) => {
    if (remaining < 0) return "bg-gradient-to-r from-red-400 to-red-600";
    if (remaining < budget * 0.2) return "bg-gradient-to-r from-yellow-400 to-yellow-600";
    return "bg-gradient-to-r from-green-400 to-green-600";
  }, []);

  const getTextColorClass = useCallback((remaining: number, budget: number) => {
    if (remaining < 0) return "text-red-600 font-medium";
    if (remaining < budget * 0.2) return "text-yellow-600 font-medium";
    return "text-green-600 font-medium";
  }, []);

  return (
    <div className="space-y-6 relative">
      {/* Categories list */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-10 px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {/* Empty header for drag handle column */}
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Assigned
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Activity
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Remaining
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {categories.map((category) => {
              const isEditing = editingId === category.id;
              const details = getCategoryDetails(category);

              return (
                <CategoryRow
                  key={category.id}
                  category={category}
                  isEditing={isEditing}
                  editingName={editingName}
                  editingBudget={editingBudget}
                  menuOpenId={menuOpenId}
                  currencyFormat={currencyFormat}
                  currencySymbol={currencySymbol}
                  {...details}
                  onDragStart={(e) => handleDragStart(e, category.id)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, category.id)}
                  onEditingNameChange={setEditingName}
                  onEditingBudgetChange={setEditingBudget}
                  onUpdate={() => handleUpdateCategory(category.id)}
                  onCancelEdit={resetEditingState}
                  onDelete={() => handleRemoveCategory(category.id)}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryList; 