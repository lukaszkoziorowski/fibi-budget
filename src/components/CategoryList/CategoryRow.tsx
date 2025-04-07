import { useState } from 'react';
import { Category } from '@/types';
import { CurrencyFormat } from '@/types';
import { formatCurrency } from '@/utils/formatters';

interface CategoryRowProps {
  category: Category;
  isEditing: boolean;
  editingName: string;
  editingBudget: string;
  menuOpenId: string | null;
  currencyFormat: CurrencyFormat;
  currencySymbol: string;
  activity: number;
  remaining: number;
  percentUsed: number;
  progressClass: string;
  textColorClass: string;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onEditingNameChange: (name: string) => void;
  onEditingBudgetChange: (budget: string) => void;
  onUpdate: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
}

export const CategoryRow = ({
  category,
  isEditing,
  editingName,
  editingBudget,
  menuOpenId,
  currencyFormat,
  currencySymbol,
  activity,
  remaining,
  percentUsed,
  progressClass,
  textColorClass,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onEditingNameChange,
  onEditingBudgetChange,
  onUpdate,
  onCancelEdit,
  onDelete
}: CategoryRowProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <tr
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="hover:bg-gray-50"
    >
      <td className="px-3 py-4 whitespace-nowrap">
        <div className="flex items-center justify-center">
          <svg
            className="h-5 w-5 text-gray-400 cursor-move"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <input
            type="text"
            value={editingName}
            onChange={(e) => onEditingNameChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent"
            style={{ transform: 'none' }}
          />
        ) : (
          <div className="text-sm font-medium text-gray-900">{category.name}</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <input
            type="number"
            value={editingBudget}
            onChange={(e) => onEditingBudgetChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent"
            style={{ transform: 'none' }}
          />
        ) : (
          <div className="text-sm text-gray-900">
            {currencySymbol}{category.budget.toLocaleString()}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {currencySymbol}{activity.toLocaleString()}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-1">
            <div className="text-sm text-gray-900">
              <span className={textColorClass}>
                {currencySymbol}{remaining.toLocaleString()}
              </span>
            </div>
            <div className="mt-1">
              <div className="h-1 bg-gray-200 rounded-full">
                <div
                  className={`h-1 rounded-full ${progressClass}`}
                  style={{ width: `${percentUsed}%` }}
                />
              </div>
            </div>
          </div>
          <div className="ml-4">
            {isEditing ? (
              <div className="flex space-x-2">
                <button
                  onClick={onUpdate}
                  className="text-green-600 hover:text-green-800"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  onClick={onCancelEdit}
                  className="text-red-600 hover:text-red-800"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={handleDeleteClick}
                className="text-red-600 hover:text-red-800"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}; 