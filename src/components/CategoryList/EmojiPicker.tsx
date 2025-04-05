import { useRef } from 'react';
import { emojiCategories } from '@/utils/emojiData';

interface EmojiPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (emoji: string) => void;
  emojiSearch: string;
  onSearchChange: (search: string) => void;
  activeCategory: number;
  onCategoryChange: (index: number) => void;
}

export const EmojiPicker = ({
  isOpen,
  onClose,
  onSelect,
  emojiSearch,
  onSearchChange,
  activeCategory,
  onCategoryChange,
}: EmojiPickerProps) => {
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const getFilteredEmojis = () => {
    if (!emojiSearch) {
      return emojiCategories[activeCategory].emojis;
    }
    
    const searchLower = emojiSearch.toLowerCase();
    const allEmojis = emojiCategories.flatMap(cat => cat.emojis);
    return allEmojis.filter(emoji => emoji.includes(searchLower));
  };

  if (!isOpen) return null;

  return (
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
          onChange={(e) => onSearchChange(e.target.value)}
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
              onClick={() => onCategoryChange(index)}
              className={`px-2 py-1 text-xs rounded-md transition-colors ${
                activeCategory === index 
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
              onClick={() => onSelect(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}; 