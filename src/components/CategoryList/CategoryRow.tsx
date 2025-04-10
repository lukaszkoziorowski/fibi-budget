import React from 'react';
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
  onDragStart: (e: React.DragEvent<HTMLTableRowElement>) => void;
  onDragEnd: (e: React.DragEvent<HTMLTableRowElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLTableRowElement>) => void;
  onDrop: (e: React.DragEvent<HTMLTableRowElement>) => void;
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
  currencyFormat,
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
            className="h-4 w-4 text-gray-300 cursor-move"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 9h14M5 15h14"
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
            {formatCurrency(category.budget, currencyFormat)}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {formatCurrency(activity, currencyFormat)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-1">
            <div className="text-sm text-gray-900">
              <span className={textColorClass}>
                {formatCurrency(remaining, currencyFormat)}
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
                  aria-label="Save"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  onClick={onCancelEdit}
                  className="text-red-600 hover:text-red-800"
                  aria-label="Cancel"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={handleDeleteClick}
                className="text-red-400 hover:text-red-600"
                aria-label="Delete"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}; 