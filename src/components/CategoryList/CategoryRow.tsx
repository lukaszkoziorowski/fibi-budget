import { Category } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { CurrencyFormat } from '@/types';

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
  onEditingNameChange: (value: string) => void;
  onEditingBudgetChange: (value: string) => void;
  onUpdate: () => void;
  onCancelEdit: () => void;
  onToggleMenu: (e: React.MouseEvent) => void;
  onStartEditing: () => void;
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
  onToggleMenu,
  onStartEditing,
  onDelete,
}: CategoryRowProps) => {
  return (
    <tr 
      className={`hover:bg-gray-50 ${isEditing ? 'bg-gray-50' : 'transition-colors'}`}
      draggable={!isEditing}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <td className="px-3 py-5 whitespace-nowrap">
        {!isEditing && (
          <div className="flex justify-center">
            <button 
              className="p-1 text-gray-400 cursor-grab active:cursor-grabbing hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
            </button>
          </div>
        )}
      </td>
      <td className="px-6 py-5 whitespace-nowrap">
        {isEditing ? (
          <div className="flex items-center">
            <input
              type="text"
              value={editingName}
              onChange={(e) => onEditingNameChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[rgb(88,0,159)] focus:border-[rgb(88,0,159)] transition-colors"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onUpdate();
                }
              }}
              autoFocus
            />
          </div>
        ) : (
          <div className="text-sm font-medium text-gray-800">
            {category.name}
          </div>
        )}
      </td>
      <td className="px-6 py-5 whitespace-nowrap">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{currencySymbol}</span>
            <input
              type="number"
              value={editingBudget}
              onChange={(e) => onEditingBudgetChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[rgb(88,0,159)] focus:border-[rgb(88,0,159)] transition-colors"
              step="0.01"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onUpdate();
                }
              }}
            />
          </div>
        ) : (
          <div className="text-sm font-medium text-gray-700">
            {formatCurrency(category.budget, currencyFormat)}
          </div>
        )}
      </td>
      <td className="px-6 py-5 whitespace-nowrap">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{currencySymbol}</span>
            <input
              type="number"
              value={activity}
              disabled
              className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-500"
              style={{ transform: 'none' }}
            />
          </div>
        ) : (
          <div className="text-sm text-gray-600 font-medium">
            {formatCurrency(activity, currencyFormat)}
          </div>
        )}
      </td>
      <td className="px-6 py-5 whitespace-nowrap relative">
        <div className="flex justify-between items-center w-full">
          <div className="w-full mr-10">
            <div className={`text-sm ${textColorClass} mb-2`}>
              {formatCurrency(remaining, currencyFormat)}
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full ${progressClass} transition-colors duration-1000 ease-out animate-pulse`}
                style={{
                  width: `${percentUsed}%`,
                  animation: `${remaining < 0 ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : ''}`
                }}
              />
            </div>
          </div>
          
          {isEditing ? (
            <div className="flex gap-2 ml-2 flex-shrink-0">
              <button
                onClick={onUpdate}
                className="p-1.5 bg-[rgb(88,0,159)] text-white rounded-md hover:bg-[rgb(73,0,132)] transition-colors flex items-center shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                onClick={onCancelEdit}
                className="p-1.5 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="relative flex-shrink-0">
              <button 
                onClick={onToggleMenu}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                style={{ transform: 'none' }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
              
              {menuOpenId === category.id && (
                <div 
                  className="absolute top-full mt-1 right-0 w-36 bg-white rounded-md shadow-lg z-10 border border-gray-200 py-1"
                >
                  <button
                    onClick={onStartEditing}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={onDelete}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}; 