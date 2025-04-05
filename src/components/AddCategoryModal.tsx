import { useState, useEffect, useRef, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { addCategory } from '@/store/budgetSlice';
import { emojiCategories } from '@/utils/emojiData';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddCategoryModal = ({ isOpen, onClose }: AddCategoryModalProps) => {
  const dispatch = useDispatch();
  const [selectedEmoji, setSelectedEmoji] = useState('📋');
  const [categoryName, setCategoryName] = useState('');
  const [budget, setBudget] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiSearch, setEmojiSearch] = useState('');
  const [activeEmojiCategory, setActiveEmojiCategory] = useState(0);
  
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    dispatch(
      addCategory({
        id: Date.now().toString(),
        name: `${selectedEmoji} ${categoryName.trim()}`,
        budget: Number(budget) || 0,
      })
    );

    setCategoryName('');
    setSelectedEmoji('📋');
    setBudget('');
    onClose();
  };

  // Memoized filtered emojis for better performance
  const filteredEmojis = useMemo(() => {
    if (!emojiSearch) {
      return emojiCategories[activeEmojiCategory].emojis;
    }
    
    const searchLower = emojiSearch.toLowerCase();
    const allEmojis = emojiCategories.flatMap(cat => cat.emojis);
    
    return allEmojis.filter(({ emoji, description }) => {
      return description.toLowerCase().includes(searchLower);
    });
  }, [emojiSearch, activeEmojiCategory]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              {/* Close button */}
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 focus:outline-none transition-colors duration-200"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                Add Category
              </Dialog.Title>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Emoji and Name Input Row */}
                <div className="flex items-center gap-3">
                  {/* Emoji Selector */}
                  <div className="relative flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="h-10 w-10 flex items-center justify-center text-xl bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                    >
                      {selectedEmoji}
                    </button>
                    
                    {showEmojiPicker && (
                      <div 
                        ref={emojiPickerRef}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 border border-gray-200 p-6 w-[360px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Search bar */}
                        <div className="mb-4">
                          <div className="relative">
                            <input
                              type="text"
                              value={emojiSearch}
                              onChange={(e) => setEmojiSearch(e.target.value)}
                              placeholder="Search emojis..."
                              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
                              autoFocus
                            />
                            <svg 
                              className="absolute left-3 top-3 h-4 w-4 text-gray-400" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                              />
                            </svg>
                          </div>
                        </div>

                        {!emojiSearch && (
                          <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-2">
                            {emojiCategories.map((category, index) => (
                              <button
                                key={category.name}
                                type="button"
                                onClick={() => setActiveEmojiCategory(index)}
                                className={`px-3 py-1.5 text-sm rounded-lg whitespace-nowrap flex-shrink-0 ${
                                  activeEmojiCategory === index
                                    ? 'bg-purple-100 text-purple-700 font-medium'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                {category.name}
                              </button>
                            ))}
                          </div>
                        )}

                        <div className="grid grid-cols-8 gap-1.5 h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-2">
                          {filteredEmojis.map(({ emoji, description }) => (
                            <button
                              key={description}
                              type="button"
                              onClick={() => {
                                setSelectedEmoji(emoji);
                                setShowEmojiPicker(false);
                              }}
                              className="w-10 h-10 flex items-center justify-center text-xl hover:bg-gray-100 rounded-lg transition-colors"
                              title={description}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Category Name Input */}
                  <input
                    type="text"
                    id="categoryName"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter category name"
                    required
                  />
                </div>

                {/* Budget Input */}
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <div className="mb-2 text-sm font-medium text-gray-700">
                    Assign Budget
                  </div>
                  <div className="relative flex items-center justify-center">
                    <input
                      type="number"
                      id="budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="bg-transparent text-6xl font-light text-center focus:outline-none text-content-primary w-48"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-5 sm:mt-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center w-full rounded-md border border-[rgb(102,0,176)] shadow-sm px-4 py-2 bg-[rgb(88,0,159)] text-base font-medium text-white hover:bg-[rgb(73,0,132)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:text-sm transition-colors"
                  >
                    Add Category
                  </button>
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddCategoryModal; 