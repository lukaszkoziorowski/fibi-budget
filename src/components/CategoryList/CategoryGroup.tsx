import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { CategoryRow } from './CategoryRow';
import { useCurrency } from '@/hooks/useCurrency';
import { CategoryGroup as CategoryGroupType } from '@/types';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface CategoryGroupProps {
  group: CategoryGroupType;
  onToggleCollapse: (groupId: string) => void;
  children: React.ReactNode;
}

export const CategoryGroup = ({ group, onToggleCollapse, children }: CategoryGroupProps) => {
  const [, setIsHovered] = useState(false);

  return (
    <div
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="flex items-center justify-between p-2 bg-gray-50 cursor-pointer hover:bg-gray-100"
        onClick={() => onToggleCollapse(group.id)}
      >
        <div className="flex items-center space-x-2">
          <ChevronDownIcon
            className={`w-5 h-5 text-gray-500 transition-transform ${
              group.isCollapsed ? '-rotate-90' : ''
            }`}
          />
          <span className="font-medium">{group.name}</span>
        </div>
      </div>
      {!group.isCollapsed && children}
    </div>
  );
};

interface CategoryGroupComponentProps {
  groupId: string;
}

export const CategoryGroupComponent = ({ groupId }: CategoryGroupComponentProps) => {
  const dispatch = useDispatch();
  const { currencyFormat, currencySymbol } = useCurrency();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const group = useSelector((state: RootState) => 
    state.budget.categoryGroups.find(g => g.id === groupId)
  );

  const categories = useSelector((state: RootState) =>
    state.budget.categories.filter(c => c.groupId === groupId)
  );

  const handleToggleExpand = () => {
    dispatch({
      type: 'budget/updateCategoryGroup',
      payload: {
        id: groupId,
        isCollapsed: !group?.isCollapsed
      }
    });
  };

  const handleNameChange = (event: React.FocusEvent<HTMLInputElement>) => {
    dispatch({
      type: 'budget/updateCategoryGroup',
      payload: {
        id: groupId,
        name: event.target.value
      }
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    dispatch({
      type: 'budget/deleteCategoryGroup',
      payload: groupId
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-gray-50');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-gray-50');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-gray-50');
    
    const categoryId = e.dataTransfer.getData('text/plain');
    if (categoryId) {
      dispatch({
        type: 'budget/updateCategory',
        payload: {
          id: categoryId,
          groupId
        }
      });
    }
  };

  if (!group) return null;

  return (
    <div
      role="group"
      className="mb-4"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between p-2 bg-gray-100 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleExpand}
            aria-label="Toggle group"
            className="p-1 hover:bg-gray-200 rounded"
          >
            <svg
              className={`h-4 w-4 transform transition-transform ${
                group.isCollapsed ? 'rotate-90' : ''
              }`}
              fill="none" 
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          {isEditing ? (
            <input
              type="text"
              defaultValue={group.name}
              onBlur={handleNameChange}
              className="px-2 py-1 border rounded"
              autoFocus
            />
          ) : (
            <h3 className="font-medium">{group.name}</h3>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            aria-label="Edit group"
            className="p-1 hover:bg-gray-200 rounded"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            aria-label="Delete group"
            className="p-1 hover:bg-gray-200 rounded text-red-600"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {!group.isCollapsed && (
        <div className="border border-t-0 rounded-b-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <CategoryRow
                  key={category.id}
                  category={category}
                  currencyFormat={currencyFormat}
                  currencySymbol={currencySymbol}
                  isEditing={false}
                  editingName=""
                  editingBudget=""
                  menuOpenId={null}
                  activity={0}
                  remaining={0}
                  percentUsed={0}
                  progressClass="bg-green-500"
                  textColorClass="text-green-600"
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', category.id);
                  }}
                  onDragEnd={() => {}}
                  onDragOver={() => {}}
                  onDrop={() => {}}
                  onEditingNameChange={() => {}}
                  onEditingBudgetChange={() => {}}
                  onUpdate={() => {}}
                  onCancelEdit={() => {}}
                  onDelete={() => {}}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h4 className="text-lg font-medium mb-4">Delete Group</h4>
            <p className="mb-4">Are you sure you want to delete this group?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 