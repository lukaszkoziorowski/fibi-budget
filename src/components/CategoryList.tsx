import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addCategory, deleteCategory, updateCategory, reorderCategories } from '@/store/budgetSlice';
import { formatCurrency } from '@/utils/formatters';
import { useCurrency } from '@/hooks/useCurrency';
import { useExchangeRates } from '@/hooks/useExchangeRates';
import { calculateCategoryActivity, validateCategoryOperation } from '@/utils/categoryUtils';
import { emojiCategories } from '@/utils/emojiData';
import { useBudgetStats } from '@/hooks/useBudgetStats';
import { useModal } from '@/hooks/useModal';

interface CategoryListProps {
  isEditing: boolean;
}

const CategoryList = ({ isEditing }: CategoryListProps) => {
  const dispatch = useDispatch();
  const { categories, transactions, currentMonth } = useSelector((state: RootState) => state.budget);
  const { currencyFormat, currencySymbol } = useCurrency();
  const { convertAmount } = useExchangeRates(transactions, currencyFormat.currency);
  const { getCategoryStats } = useBudgetStats();
  const emojiPicker = useModal();
  
  // State management
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('📋');
  const [emojiSearch, setEmojiSearch] = useState('');
  const [activeEmojiCategory, setActiveEmojiCategory] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingBudget, setEditingBudget] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [draggedCategoryId, setDraggedCategoryId] = useState<string | null>(null);

  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        emojiPicker.closeModal();
      }
      setMenuOpenId(null);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Category operations
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    dispatch(
      addCategory({
        id: Date.now().toString(),
        name: `${selectedEmoji} ${newCategoryName.trim()}`,
        budget: 0,
      })
    );
    setNewCategoryName('');
  };

  const handleUpdateCategory = (id: string) => {
    if (!validateCategoryOperation.canUpdate(editingName, editingBudget)) return;
    
    const category = categories.find((c) => c.id === id);
    if (!category) return;
    
    dispatch(updateCategory({
      id,
      name: editingName.trim(),
      budget: Number(editingBudget) || category.budget,
    }));
    resetEditingState();
  };

  const handleRemoveCategory = (id: string) => {
    if (!validateCategoryOperation.canDelete(id, transactions)) {
      alert('Cannot delete a category that has transactions assigned to it.');
      return;
    }
    dispatch(deleteCategory(id));
  };

  const handleStartEditing = (category: { id: string; name: string; budget: number }) => {
    setEditingId(category.id);
    setEditingName(category.name);
    setEditingBudget(category.budget.toString());
    setMenuOpenId(null);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, categoryId: string) => {
    setDraggedCategoryId(categoryId);
    e.dataTransfer.effectAllowed = 'move';
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.add('opacity-50');
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedCategoryId(null);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.remove('opacity-50');
    }
  };

  const handleDrop = (e: React.DragEvent, targetCategoryId: string) => {
    e.preventDefault();
    if (!draggedCategoryId || draggedCategoryId === targetCategoryId) return;
    
    const draggedIndex = categories.findIndex(c => c.id === draggedCategoryId);
    const targetIndex = categories.findIndex(c => c.id === targetCategoryId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    const newCategories = [...categories];
    const [movedCategory] = newCategories.splice(draggedIndex, 1);
    newCategories.splice(targetIndex, 0, movedCategory);
    
    dispatch(reorderCategories(newCategories));
  };

  // Helper functions
  const resetEditingState = () => {
    setEditingId(null);
    setEditingName('');
    setEditingBudget('');
  };

  const getFilteredEmojis = () => {
    if (!emojiSearch) {
      return emojiCategories[activeEmojiCategory].emojis;
    }
    
    const searchLower = emojiSearch.toLowerCase();
    const allEmojis = emojiCategories.flatMap(cat => cat.emojis);
    return allEmojis.filter(emoji => emoji.includes(searchLower));
  };

  // UI Event Handlers
  const toggleMenu = (e: React.MouseEvent, categoryId: string) => {
    e.stopPropagation();
    setMenuOpenId(menuOpenId === categoryId ? null : categoryId);
  };

  const toggleEmojiPicker = (e: React.MouseEvent) => {
    e.stopPropagation();
    emojiPicker.toggleModal();
    if (!emojiPicker.isOpen) {
      setEmojiSearch('');
      setActiveEmojiCategory(0);
    }
  };

  const selectEmoji = (emoji: string) => {
    setSelectedEmoji(emoji);
    emojiPicker.closeModal();
  };

  // Category calculations
  const getCategoryDetails = (category: { id: string; budget: number }) => {
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
  };

  // Style helpers
  const getProgressClass = (remaining: number, budget: number) => {
    if (remaining < 0) return "bg-gradient-to-r from-red-400 to-red-600";
    if (remaining < budget * 0.2) return "bg-gradient-to-r from-yellow-400 to-yellow-600";
    return "bg-gradient-to-r from-green-400 to-green-600";
  };

  const getTextColorClass = (remaining: number, budget: number) => {
    if (remaining < 0) return "text-red-600 font-medium";
    if (remaining < budget * 0.2) return "text-yellow-600 font-medium";
    return "text-green-600 font-medium";
  };

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
              const { activity, remaining, percentUsed, progressClass, textColorClass } = getCategoryDetails(category);

              return (
                <tr 
                  key={category.id} 
                  className={`hover:bg-gray-50 ${isEditing ? 'bg-gray-50' : 'transition-colors'}`}
                  draggable={!isEditing}
                  onDragStart={e => handleDragStart(e, category.id)}
                  onDragEnd={handleDragEnd}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => handleDrop(e, category.id)}
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
                          onChange={(e) => setEditingName(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[rgb(88,0,159)] focus:border-[rgb(88,0,159)] transition-colors"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleUpdateCategory(category.id);
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
                          onChange={(e) => setEditingBudget(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[rgb(88,0,159)] focus:border-[rgb(88,0,159)] transition-colors"
                          step="0.01"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleUpdateCategory(category.id);
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
                            onClick={() => handleUpdateCategory(category.id)}
                            className="p-1.5 bg-[rgb(88,0,159)] text-white rounded-md hover:bg-[rgb(73,0,132)] transition-colors flex items-center shadow-sm"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditingName('');
                              setEditingBudget('');
                            }}
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
                            onClick={(e) => toggleMenu(e, category.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            style={{ transform: 'none' }}
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                          
                          {menuOpenId === category.id && (
                            <div 
                              className={`absolute ${
                                // Check if we're near the bottom of the table
                                categories.indexOf(category) > categories.length - 3
                                  ? 'bottom-full mb-1' // Position above
                                  : 'top-full mt-1'    // Position below
                              } right-0 w-36 bg-white rounded-md shadow-lg z-10 border border-gray-200 py-1`}
                            >
                              <button
                                onClick={() => handleStartEditing(category)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                              </button>
                              <button
                                onClick={() => handleRemoveCategory(category.id)}
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
            })}
          </tbody>
        </table>
      </div>
      
      {/* Fixed Add Category Section */}
      {isEditing && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 py-3 px-4 mt-2 sticky bottom-0 z-10">
          <form onSubmit={handleAddCategory} className="flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={toggleEmojiPicker}
                className="h-10 w-10 flex items-center justify-center text-xl bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                style={{ transform: 'none' }}
              >
                {selectedEmoji}
              </button>
              
              {emojiPicker.isOpen && (
                <div 
                  ref={emojiPickerRef}
                  className="absolute left-0 bottom-12 bg-white rounded-md shadow-lg z-20 border border-gray-200 p-2 w-80"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Search bar */}
                  <div className="mb-2 pb-2 border-b border-gray-200">
                    <input
                      type="text"
                      value={emojiSearch}
                      onChange={(e) => setEmojiSearch(e.target.value)}
                      placeholder="Search emojis..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                      style={{ transform: 'none' }}
                    />
                  </div>
                  
                  {/* Emoji category tabs */}
                  {!emojiSearch && (
                    <div className="mb-2 pb-2 border-b border-gray-200 flex flex-wrap gap-1">
                      {emojiCategories.map((category, index) => (
                        <button
                          key={category.name}
                          type="button"
                          onClick={() => setActiveEmojiCategory(index)}
                          className={`px-2 py-1 text-xs rounded-md transition-colors ${
                            activeEmojiCategory === index 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                          style={{ transform: 'none' }}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Emoji grid */}
                  <div className="h-48 overflow-y-auto">
                    <div className="grid grid-cols-8 gap-1">
                      {getFilteredEmojis().map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          className="h-8 w-8 flex items-center justify-center text-lg hover:bg-gray-100 rounded transition-colors"
                          style={{ transform: 'none' }}
                          onClick={() => selectEmoji(emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter new category name"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent"
              style={{ transform: 'none' }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddCategory(e);
                }
              }}
            />
          </form>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
