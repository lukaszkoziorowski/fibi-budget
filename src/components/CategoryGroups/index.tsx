import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  addCategoryGroup,
  updateCategoryGroup,
  deleteCategoryGroup,
  toggleGroupCollapse,
  moveCategoryToGroup,
  updateCategory,
  deleteCategory,
  reorderCategories
} from '@/store/budgetSlice';
import { Category } from '@/types';
import { CategoryRow } from '../CategoryList/CategoryRow';
import { Dialog } from '@headlessui/react';
import { ChevronDownIcon, PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useCurrency } from '@/hooks/useCurrency';
import { useExchangeRates } from '@/hooks/useExchangeRates';
import { calculateCategoryActivity } from '@/utils/categoryUtils';
import { AddCategoryModal } from '../AddCategoryModal';

const CategoryGroups: React.FC = () => {
  const dispatch = useDispatch();
  const { categoryGroups, categories, transactions, currentMonth } = useSelector((state: RootState) => state.budget);
  const { currencyFormat, currencySymbol } = useCurrency();
  const { convertAmount } = useExchangeRates(transactions, currencyFormat.currency);

  // State for add/edit group modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'delete'>('add');
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [groupName, setGroupName] = useState('');

  // State for add category modal
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [addCategoryToGroupId, setAddCategoryToGroupId] = useState<string | null>(null);

  // State for drag and drop
  const [draggedCategoryId, setDraggedCategoryId] = useState<string | null>(null);

  // State for editing categories
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [editingCategoryBudget, setEditingCategoryBudget] = useState('');

  // Get ungrouped categories and filter out empty or unnamed groups
  const ungroupedCategories = categories.filter(c => !c.groupId || !categoryGroups.find(g => g.id === c.groupId));
  const validGroups = categoryGroups.filter(group => group.name && group.name.trim() !== '');


  const handleEditGroup = (id: string, name: string) => {
    setModalMode('edit');
    setEditingGroupId(id);
    setGroupName(name);
    setIsModalOpen(true);
  };

  const handleDeleteGroup = (id: string) => {
    setModalMode('delete');
    setEditingGroupId(id);
    setIsModalOpen(true);
  };

  const handleSaveGroup = () => {
    if (modalMode === 'delete') {
      if (editingGroupId) {
        dispatch(deleteCategoryGroup(editingGroupId));
      }
    } else {
      if (!groupName.trim()) return;

      if (modalMode === 'add') {
        dispatch(addCategoryGroup({ name: groupName.trim() }));
      } else if (editingGroupId) {
        dispatch(updateCategoryGroup({ id: editingGroupId, name: groupName.trim() }));
      }
    }

    setIsModalOpen(false);
    setGroupName('');
    setEditingGroupId(null);
  };

  const handleAddCategory = (groupId: string) => {
    setAddCategoryToGroupId(groupId);
    setIsAddCategoryModalOpen(true);
  };

  const handleDragStart = (e: React.DragEvent, categoryId: string) => {
    setDraggedCategoryId(categoryId);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.add('opacity-50');
    }
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedCategoryId(null);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.remove('opacity-50');
    }
  };

  const handleDrop = (e: React.DragEvent, groupId: string, targetCategoryId?: string) => {
    e.preventDefault();
    if (!draggedCategoryId) return;

    const draggedCategory = categories.find(c => c.id === draggedCategoryId);
    if (!draggedCategory) return;

    // If dropping on a category within the same group, reorder
    if (targetCategoryId && draggedCategory.groupId === groupId) {
      const groupCategories = categories.filter(c => c.groupId === groupId);
      const otherCategories = categories.filter(c => c.groupId !== groupId);
      
      const draggedIndex = groupCategories.findIndex(c => c.id === draggedCategoryId);
      const targetIndex = groupCategories.findIndex(c => c.id === targetCategoryId);
      
      if (draggedIndex === -1 || targetIndex === -1) return;
      
      // Create a new array with the reordered categories
      const newGroupCategories = [...groupCategories];
      const [movedCategory] = newGroupCategories.splice(draggedIndex, 1);
      
      // Adjust target index if we're moving an item down
      const adjustedTargetIndex = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;
      newGroupCategories.splice(adjustedTargetIndex, 0, movedCategory);
      
      // Combine reordered group categories with other categories
      const allCategories = [...otherCategories];
      allCategories.push(...newGroupCategories);
      
      dispatch(reorderCategories(allCategories));
    } else {
      // If dropping on a group, move the category to that group
      dispatch(moveCategoryToGroup({ categoryId: draggedCategoryId, groupId }));
    }
    
    setDraggedCategoryId(null);
  };

  const handleEditCategory = useCallback((category: Category) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
    setEditingCategoryBudget(category.budget.toString());
  }, []);

  const handleUpdateCategory = useCallback((id: string) => {
    const category = categories.find((c) => c.id === id);
    if (!category || !editingCategoryName.trim() || !editingCategoryBudget) return;
    
    dispatch(updateCategory({
      id,
      name: editingCategoryName.trim(),
      budget: Number(editingCategoryBudget),
    }));
    
    setEditingCategoryId(null);
    setEditingCategoryName('');
    setEditingCategoryBudget('');
  }, [categories, dispatch, editingCategoryName, editingCategoryBudget]);

  const handleCancelEdit = useCallback(() => {
    setEditingCategoryId(null);
    setEditingCategoryName('');
    setEditingCategoryBudget('');
  }, []);

  const handleDeleteCategory = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      dispatch(deleteCategory(id));
    }
  }, [dispatch]);

  return (
    <div className="space-y-4">
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <div className="relative bg-white rounded-lg p-4 w-full max-w-md mx-4">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              {modalMode === 'add' ? 'Add Group' : modalMode === 'edit' ? 'Edit Group' : 'Delete Group'}
            </Dialog.Title>
            {modalMode === 'delete' ? (
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this group? All categories in this group will be deleted as well.
                </p>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveGroup}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveGroup}
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
                  >
                    {modalMode === 'add' ? 'Add' : 'Save'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Dialog>

      {isAddCategoryModalOpen && (
        <AddCategoryModal
          onClose={() => setIsAddCategoryModalOpen(false)}
          groupId={addCategoryToGroupId || undefined}
        />
      )}

      <div className="space-y-4">
        {/* Render ungrouped categories first */}
        {ungroupedCategories.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200">
            <div className="p-4">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="w-10"></th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remaining
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ungroupedCategories.map((category) => {
                    const activity = calculateCategoryActivity(
                      category.id,
                      transactions,
                      currentMonth,
                      convertAmount
                    );
                    const remaining = category.budget - activity;
                    const percentUsed = category.budget > 0 ? Math.min((activity / category.budget) * 100, 100) : 0;
                    const progressClass = remaining < 0 
                      ? "bg-red-500" 
                      : remaining < 0.2 * category.budget 
                        ? "bg-yellow-500" 
                        : "bg-green-500";
                    const textColorClass = remaining < 0 
                      ? "text-red-600" 
                      : remaining < 0.2 * category.budget 
                        ? "text-yellow-600" 
                        : "text-green-600";
                    const isEditing = editingCategoryId === category.id;

                    return (
                      <CategoryRow
                        key={category.id}
                        category={category}
                        isEditing={isEditing}
                        editingName={editingCategoryName}
                        editingBudget={editingCategoryBudget}
                        menuOpenId={null}
                        currencyFormat={currencyFormat}
                        currencySymbol={currencySymbol}
                        activity={activity}
                        remaining={remaining}
                        percentUsed={percentUsed}
                        progressClass={progressClass}
                        textColorClass={textColorClass}
                        onDragStart={(e) => handleDragStart(e, category.id)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, '', category.id)}
                        onEditingNameChange={setEditingCategoryName}
                        onEditingBudgetChange={setEditingCategoryBudget}
                        onUpdate={() => handleUpdateCategory(category.id)}
                        onCancelEdit={handleCancelEdit}
                        onDelete={() => handleDeleteCategory(category.id)}
                        onClick={() => {
                          if (!isEditing) {
                            handleEditCategory(category);
                          }
                        }}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Render only valid user-created groups */}
        {validGroups.map((group) => {
          const groupCategories = categories.filter(c => c.groupId === group.id);

          return (
            <div
              key={group.id}
              className={`bg-white rounded-lg shadow-sm border-2 transition-colors ${
                draggedCategoryId ? 'border-blue-300 border-dashed' : 'border-gray-200'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add('bg-blue-50');
                e.dataTransfer.dropEffect = 'move';
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove('bg-blue-50');
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('bg-blue-50');
                handleDrop(e, group.id);
              }}
            >
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-t-lg">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => dispatch(toggleGroupCollapse(group.id))}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ChevronDownIcon
                      className={`w-5 h-5 transition-transform ${
                        group.isCollapsed ? '-rotate-90' : ''
                      }`}
                    />
                  </button>
                  <h3 className="text-sm font-medium text-gray-900">{group.name}</h3>
                  <span className="text-sm text-gray-500">({groupCategories.length})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAddCategory(group.id)}
                    className="p-1 text-purple-400 hover:text-purple-600"
                    aria-label="Add category to group"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEditGroup(group.id, group.name)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    aria-label="Edit group"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteGroup(group.id)}
                    className="p-1 text-red-400 hover:text-red-600"
                    aria-label="Delete group"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {!group.isCollapsed && (
                <div className="border border-t-0 rounded-b-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="bg-white divide-y divide-gray-200">
                      {groupCategories.map((category) => {
                        const activity = calculateCategoryActivity(
                          category.id,
                          transactions,
                          currentMonth,
                          convertAmount
                        );
                        const remaining = category.budget - activity;
                        const percentUsed = category.budget > 0 ? Math.min((activity / category.budget) * 100, 100) : 0;
                        const progressClass = percentUsed >= 100 ? 'bg-red-500' : 'bg-green-500';
                        const textColorClass = percentUsed >= 100 ? 'text-red-600' : 'text-green-600';
                        const isEditing = editingCategoryId === category.id;

                        return (
                          <CategoryRow
                            key={category.id}
                            category={category}
                            isEditing={isEditing}
                            editingName={editingCategoryName}
                            editingBudget={editingCategoryBudget}
                            menuOpenId={null}
                            currencyFormat={currencyFormat}
                            currencySymbol={currencySymbol}
                            activity={activity}
                            remaining={remaining}
                            percentUsed={percentUsed}
                            progressClass={progressClass}
                            textColorClass={textColorClass}
                            onDragStart={(e) => handleDragStart(e, category.id)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.currentTarget.classList.add('bg-blue-50');
                              e.dataTransfer.dropEffect = 'move';
                            }}
                            onDrop={(e) => handleDrop(e, group.id, category.id)}
                            onEditingNameChange={setEditingCategoryName}
                            onEditingBudgetChange={setEditingCategoryBudget}
                            onUpdate={() => handleUpdateCategory(category.id)}
                            onCancelEdit={handleCancelEdit}
                            onDelete={() => handleDeleteCategory(category.id)}
                            onClick={() => {
                              if (!isEditing) {
                                handleEditCategory(category);
                              }
                            }}
                          />
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryGroups; 