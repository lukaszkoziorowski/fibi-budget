import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { toggleGroupCollapse, moveCategoryToGroup, addCategoryGroup, updateCategoryGroup, deleteCategoryGroup, addCategory, deleteCategory, updateCategory } from '@/store/budgetSlice';
import { ChevronDownIcon, PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';
import { useExchangeRates } from '@/hooks/useExchangeRates';
import { calculateCategoryActivity } from '@/utils/categoryUtils';
import { Dialog } from '@headlessui/react';
import { formatCurrency, parseCurrency } from '@/utils/formatters';
import { Transaction as BudgetTransaction } from '@/types';
import { Transaction as AccountTransaction } from '@/store/accountsSlice';

// Add type adapter function
const adaptTransaction = (transaction: AccountTransaction | BudgetTransaction): BudgetTransaction => {
  if ('accountId' in transaction) {
    // It's an AccountTransaction
    return {
      id: transaction.id,
      date: transaction.date,
      description: transaction.description,
      amount: transaction.type === 'credit' ? transaction.amount : -transaction.amount,
      type: transaction.type === 'credit' ? 'income' : 'expense',
      categoryId: transaction.categoryId,
      currency: transaction.currency,
      accountId: transaction.accountId
    };
  }
  // It's already a BudgetTransaction
  return transaction;
};

interface EditingCell {
  categoryId: string;
  field: 'name' | 'budget';
}

interface CategoryActivity {
  id: string;
  activity: number;
}

export const UnifiedCategoryTable: React.FC = () => {
  const dispatch = useDispatch();
  const { categories, categoryGroups, transactions: budgetTransactions, currentMonth } = useSelector((state: RootState) => state.budget);
  const { transactions: accountTransactions } = useSelector((state: RootState) => state.accounts);
  const { currencyFormat } = useCurrency();
  const { convertAmount } = useExchangeRates(currencyFormat.currency);
  const [draggedCategoryId, setDraggedCategoryId] = useState<string | null>(null);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [groupName, setGroupName] = useState('');
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'delete'>('add');
  const { user, loading } = useAuth();
  
  // Combine transactions from both sources
  const allTransactions = useMemo(() => {
    const accountTxs = accountTransactions || [];
    return [...budgetTransactions, ...accountTxs.map(adaptTransaction)];
  }, [budgetTransactions, accountTransactions]);
  
  // New state for category modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryBudget, setCategoryBudget] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  
  // State for inline editing
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input when editing starts
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingCell]);

  // Load category activities
  const [categoryActivities, setCategoryActivities] = useState<CategoryActivity[]>([]);
  useEffect(() => {
    let isMounted = true;

    const loadActivities = async () => {
      try {
        console.log('Recalculating category activities with transactions:', allTransactions.length);
        
        const activities = await Promise.all(
          categories.map(async (category) => {
            const activity = await calculateCategoryActivity(
              category.id,
              allTransactions,
              currentMonth,
              convertAmount
            );
            console.log(`Category ${category.name} activity: ${activity}`);
            return {
              id: category.id,
              activity: activity || 0
            };
          })
        );
        
        if (isMounted) {
          setCategoryActivities(activities);
        }
      } catch (error) {
        console.error('Error loading category activities:', error);
        if (isMounted) {
          setCategoryActivities(categories.map(category => ({
            id: category.id,
            activity: 0
          })));
        }
      }
    };

    loadActivities();

    return () => {
      isMounted = false;
    };
  }, [categories, allTransactions, currentMonth, convertAmount]);

  // Add a function to get activity for a category
  const getCategoryActivity = (categoryId: string) => {
    const activity = categoryActivities.find(a => a.id === categoryId);
    return activity ? activity.activity : 0;
  };

  const handleAddCategory = useCallback((groupId: string) => {
    setSelectedGroupId(groupId);
    setCategoryName('');
    setCategoryBudget('');
    setIsCategoryModalOpen(true);
  }, []);

  const handleSaveCategory = useCallback(() => {
    if (!user || !selectedGroupId || !categoryName.trim() || !categoryBudget) return;
    
    dispatch(addCategory({
      name: categoryName.trim(),
      budget: Number(categoryBudget),
      groupId: selectedGroupId
    }));
    
    setIsCategoryModalOpen(false);
    setCategoryName('');
    setCategoryBudget('');
    setSelectedGroupId(null);
  }, [dispatch, user, selectedGroupId, categoryName, categoryBudget]);

  const handleGroupClick = useCallback((groupId: string) => {
    dispatch(toggleGroupCollapse(groupId));
  }, [dispatch]);

  const handleDragStart = useCallback((e: React.DragEvent, categoryId: string) => {
    setDraggedCategoryId(categoryId);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.add('opacity-50');
    }
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    setDraggedCategoryId(null);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.remove('opacity-50');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, groupId: string) => {
    e.preventDefault();
    if (draggedCategoryId) {
      const category = categories.find(c => c.id === draggedCategoryId);
      if (category && category.groupId !== groupId) {
        dispatch(moveCategoryToGroup({ categoryId: draggedCategoryId, groupId }));
      }
      setDraggedCategoryId(null);
    }
  }, [dispatch, draggedCategoryId, categories]);

  const handleEditGroup = useCallback((groupId: string, name: string) => {
    setModalMode('edit');
    setEditingGroupId(groupId);
    setGroupName(name);
    setIsGroupModalOpen(true);
  }, []);

  const handleDeleteGroup = useCallback((groupId: string) => {
    setModalMode('delete');
    setEditingGroupId(groupId);
    setIsGroupModalOpen(true);
  }, []);

  const handleSaveGroup = useCallback(() => {
    if (!user) return;

    if (modalMode === 'delete' && editingGroupId) {
      dispatch(deleteCategoryGroup(editingGroupId));
    } else {
      if (!groupName.trim()) return;

      if (modalMode === 'edit' && editingGroupId) {
        dispatch(updateCategoryGroup({ id: editingGroupId, name: groupName.trim() }));
      } else if (modalMode === 'add') {
        dispatch(addCategoryGroup({ name: groupName.trim() }));
      }
    }

    setIsGroupModalOpen(false);
    setGroupName('');
    setEditingGroupId(null);
  }, [dispatch, modalMode, editingGroupId, groupName, user]);
  
  // Inline editing handlers
  const handleStartEditing = (categoryId: string, field: 'name' | 'budget', value: string) => {
    setEditingCell({ categoryId, field });
    // For budget field, remove currency symbol and formatting
    if (field === 'budget') {
      const numericValue = value.replace(/[^0-9.-]+/g, '');
      setEditValue(numericValue);
    } else {
      setEditValue(value);
    }
  };
  
  const handleSaveEdit = () => {
    if (!editingCell) return;

    const { categoryId, field } = editingCell;
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    let newValue: string | number = editValue;
    if (field === 'budget') {
      newValue = parseCurrency(editValue, currencyFormat);
    }

    dispatch(updateCategory({
      id: categoryId,
      [field]: newValue
    }));
    setEditingCell(null);
    setEditValue('');
  };
  
  const handleCancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden bg-white shadow-lg rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="w-10 px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {/* Empty header for expand/collapse and drag icons */}
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Assigned
              </th>
              <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Activity
              </th>
              <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Available
              </th>
              <th scope="col" className="w-32 px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {/* Empty header for actions */}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categoryGroups.map((group) => {
              const groupCategories = categories.filter(c => c.groupId === group.id);
              const groupActivity = groupCategories.reduce((sum, cat) => sum + getCategoryActivity(cat.id), 0);
              const groupBudget = groupCategories.reduce((sum, cat) => sum + cat.budget, 0);
              const groupRemaining = groupBudget - groupActivity;

              return (
                <React.Fragment key={group.id}>
                  {/* Group Header Row */}
                  <tr 
                    className={`bg-gray-50 hover:bg-gray-100 ${
                      draggedCategoryId ? 'border-blue-300 border-dashed' : ''
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add('bg-blue-50');
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove('bg-blue-50');
                    }}
                    onDrop={(e) => {
                      e.currentTarget.classList.remove('bg-blue-50');
                      handleDrop(e, group.id);
                    }}
                  >
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div 
                        className="flex items-center justify-center cursor-pointer" 
                        onClick={() => handleGroupClick(group.id)}
                        data-testid="collapse-button"
                      >
                        <ChevronDownIcon
                          className={`w-5 h-5 transition-transform ${
                            group.isCollapsed ? '-rotate-90' : ''
                          }`}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">
                          {group.name}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                          ({groupCategories.length})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end">
                        <div className="text-sm font-medium text-gray-900 w-32 text-right" style={{ paddingRight: '0.125rem' }}>
                          {formatCurrency(groupBudget, currencyFormat)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end">
                        <div className="text-sm font-medium text-gray-900 w-32 text-right" style={{ paddingRight: '0.125rem' }}>
                          {formatCurrency(groupActivity, currencyFormat)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end">
                        <div className={`text-sm font-medium w-32 text-right ${
                          groupRemaining < 0 ? 'text-red-600' : 
                          groupRemaining < 0.2 * groupBudget ? 'text-yellow-600' : 
                          'text-green-600'
                        }`} style={{ paddingRight: '0.125rem' }}>
                          {formatCurrency(groupRemaining, currencyFormat)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          className="p-1 text-purple-400 hover:text-purple-600"
                          onClick={() => handleAddCategory(group.id)}
                          aria-label="Add category"
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1 text-gray-400 hover:text-gray-600"
                          onClick={() => handleEditGroup(group.id, group.name)}
                          aria-label="Edit group"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1 text-red-400 hover:text-red-600"
                          onClick={() => handleDeleteGroup(group.id)}
                          aria-label="Delete group"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* Category Rows */}
                  {!group.isCollapsed && groupCategories.map((category) => {
                    const activity = getCategoryActivity(category.id);
                    const remaining = (category.budget || 0) - activity;
                    const percentUsed = (category.budget || 0) > 0 ? Math.min((activity / (category.budget || 1)) * 100, 100) : 0;
                    const isEditingName = editingCell?.categoryId === category.id && editingCell?.field === 'name';
                    const isEditingBudget = editingCell?.categoryId === category.id && editingCell?.field === 'budget';
                    
                    return (
                      <tr 
                        key={category.id}
                        className="hover:bg-gray-50"
                        draggable
                        onDragStart={(e) => handleDragStart(e, category.id)}
                        onDragEnd={handleDragEnd}
                      >
                        <td className="px-3 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center">
                            <div className="w-4 h-4 cursor-move">⋮⋮</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap pl-10">
                          {isEditingName ? (
                            <input
                              ref={inputRef}
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={handleSaveEdit}
                              onKeyDown={handleKeyDown}
                              className="w-full px-2 py-1 text-sm border border-purple-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent bg-white min-w-0"
                              style={{ width: 'auto', minWidth: '100px' }}
                            />
                          ) : (
                            <div 
                              className="text-sm text-gray-900 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-colors"
                              onClick={() => handleStartEditing(category.id, 'name', category.name)}
                            >
                              {category.name}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {isEditingBudget ? (
                            <div className="flex justify-end">
                              <div className="relative w-32">
                                <input
                                  ref={inputRef}
                                  type="text"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onBlur={handleSaveEdit}
                                  onKeyDown={handleKeyDown}
                                  className="w-full px-2 py-1 text-sm border border-purple-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent bg-white text-right"
                                  autoFocus
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-end">
                              <div
                                className="text-sm text-gray-900 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-colors w-32 text-right"
                                onClick={() => handleStartEditing(category.id, 'budget', category.budget.toString())}
                                style={{ paddingRight: '0.125rem' }}
                              >
                                {formatCurrency(category.budget, currencyFormat)}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end">
                            <div className="text-sm text-gray-900 w-32 text-right" style={{ paddingRight: '0.125rem' }}>
                              {formatCurrency(activity, currencyFormat)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end">
                            <div className="text-sm text-gray-900 w-32 text-right" style={{ paddingRight: '0.125rem' }}>
                              {formatCurrency(remaining, currencyFormat)}
                            </div>
                          </div>
                          <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                            <div
                              className={`h-1 rounded-full ${
                                remaining < 0 ? 'bg-red-500' : 
                                remaining < 0.2 * (category.budget || 1) ? 'bg-yellow-500' : 
                                'bg-green-500'
                              }`}
                              style={{ width: `${percentUsed}%` }}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end">
                            <button 
                              className="p-1 text-red-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg"
                              onClick={() => dispatch(deleteCategory(category.id))}
                              aria-label="Delete category"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Group Modal */}
      <Dialog
        open={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen p-4">
          <Dialog.Overlay className="fixed inset-0 bg-black/30" />
          <div className="relative bg-white rounded-xl p-6 w-full max-w-md mx-auto">
            <button
              onClick={() => setIsGroupModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg"
              aria-label="Close"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Dialog.Title className="text-xl font-semibold text-gray-900 pr-8">
              {modalMode === 'edit' ? 'Edit Group' : modalMode === 'delete' ? 'Delete Group' : 'Add Group'}
            </Dialog.Title>
            <div className="mt-6">
              {modalMode === 'delete' ? (
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this group? All categories in this group will be deleted as well.
                </p>
              ) : (
                <div className="space-y-4">
                  <label htmlFor="groupName" className="block text-sm font-medium text-gray-700">
                    Group Name
                  </label>
                  <input
                    id="groupName"
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Enter group name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base shadow-sm"
                  />
                </div>
              )}
              <div className="mt-8">
                <button
                  onClick={handleSaveGroup}
                  className={`w-full justify-center rounded-lg border border-transparent px-6 py-3 text-base font-medium text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    modalMode === 'delete' 
                      ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                      : 'bg-[rgb(88,0,159)] hover:bg-[rgb(73,0,132)] focus:ring-[rgb(88,0,159)]'
                  }`}
                >
                  {modalMode === 'delete' ? 'Delete' : modalMode === 'edit' ? 'Save' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Category Modal */}
      <Dialog
        open={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <div className="relative bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <button
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
              aria-label="Close"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Dialog.Title className="text-lg font-medium text-gray-900 pr-8">
              Add New Category
            </Dialog.Title>
            <div className="mt-6">
              <div className="mb-4">
                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  id="categoryName"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
                  placeholder="Enter category name"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="categoryBudget" className="block text-sm font-medium text-gray-700 mb-1">
                  Budget
                </label>
                <input
                  type="number"
                  id="categoryBudget"
                  value={categoryBudget}
                  onChange={(e) => setCategoryBudget(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
                  placeholder="Enter budget amount"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="mt-6">
                <button
                  onClick={handleSaveCategory}
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm bg-[rgb(88,0,159)] hover:bg-[rgb(73,0,132)] focus:ring-[rgb(88,0,159)]"
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}; 