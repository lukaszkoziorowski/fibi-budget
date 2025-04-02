import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog } from '@headlessui/react';
import { addTransaction } from '@/store/budgetSlice';
import { RootState } from '@/store';
import { currencies, getExchangeRate } from '@/utils/currencies';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTransactionModal = ({ isOpen, onClose }: AddTransactionModalProps) => {
  const dispatch = useDispatch();
  const categories = useSelector((state: RootState) => state.budget.categories);
  const transactions = useSelector((state: RootState) => state.budget.transactions);
  const globalCurrency = useSelector((state: RootState) => state.budget.globalCurrency);
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [currency, setCurrency] = useState(globalCurrency);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Reset currency when global currency changes
  useEffect(() => {
    setCurrency(globalCurrency);
  }, [globalCurrency]);

  // Get unique sellers from historical transactions
  const suggestions = Array.from(new Set(
    transactions
      .filter(t => t.type === type && t.description.toLowerCase().includes(description.toLowerCase()))
      .map(t => t.description)
  )).slice(0, 5); // Limit to 5 suggestions

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;
    if (type === 'expense' && !categoryId) return;

    const numericAmount = type === 'expense' ? -Number(amount) : Number(amount);
    let convertedAmount = numericAmount;
    let originalAmount = undefined;
    let originalCurrency = undefined;

    // Convert amount if currency is different from global currency
    if (currency !== globalCurrency) {
      const rate = await getExchangeRate(currency, globalCurrency);
      convertedAmount = numericAmount * rate;
      originalAmount = numericAmount;
      originalCurrency = currency;
    }

    dispatch(
      addTransaction({
        id: Date.now().toString(),
        amount: convertedAmount,
        description,
        categoryId: type === 'expense' ? categoryId : 'income',
        date: new Date().toISOString(),
        type,
        currency: globalCurrency,
        originalAmount,
        originalCurrency,
      })
    );

    setAmount('');
    setDescription('');
    setCategoryId('');
    setCurrency(globalCurrency);
    onClose();
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded-xl bg-white p-6 w-full relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <Dialog.Title className="text-lg font-medium leading-6 text-content-primary mb-6">
            Add Transaction
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type selector */}
            <div className="bg-gray-50 p-1 rounded-lg">
              <div className="grid grid-cols-2 gap-1 w-full">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    type === 'expense'
                      ? 'bg-white shadow text-content-primary'
                      : 'text-content-secondary hover:text-content-primary'
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    type === 'income'
                      ? 'bg-white shadow text-content-primary'
                      : 'text-content-secondary hover:text-content-primary'
                  }`}
                >
                  Income
                </button>
              </div>
            </div>

            {/* Amount and Currency input */}
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center gap-4">
                <div className="relative flex-1">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-5xl text-content-secondary font-light">
                    {currencies.find(c => c.code === currency)?.symbol || '$'}
                  </span>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-transparent text-6xl font-light text-center focus:outline-none text-content-primary"
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {currencies.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code}
                    </option>
                  ))}
                </select>
              </div>
              {currency !== globalCurrency && (
                <div className="mt-2 text-sm text-content-secondary">
                  Will be converted to {globalCurrency}
                </div>
              )}
            </div>

            {/* Seller input with autosuggest */}
            <div className="relative">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-content-secondary mb-1"
              >
                Seller
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSuggestions(true);
                  }}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-10">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDescription(suggestion);
                          setShowSuggestions(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Category select */}
            {type === 'expense' && (
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-content-secondary mb-1"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Add
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddTransactionModal; 