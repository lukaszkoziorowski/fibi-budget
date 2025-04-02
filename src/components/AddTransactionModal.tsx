import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog } from '@headlessui/react';
import { addTransaction } from '@/store/budgetSlice';
import { RootState } from '@/store';
import { currencies, getExchangeRate } from '@/utils/currencies';
import { formatCurrency } from '@/utils/formatters';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTransactionModal = ({ isOpen, onClose }: AddTransactionModalProps) => {
  const dispatch = useDispatch();
  const categories = useSelector((state: RootState) => state.budget.categories);
  const transactions = useSelector((state: RootState) => state.budget.transactions);
  const { globalCurrency, currencyFormat } = useSelector((state: RootState) => state.budget);
  
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
  )).slice(0, 5);

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
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" />
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="px-4 py-5 sm:p-6">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
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
                    <div className="relative flex items-center justify-center">
                      {currencyFormat.placement === 'before' && (
                        <span className="text-5xl text-content-secondary font-light mr-2">
                          {currencies.find(c => c.code === currency)?.symbol || '$'}
                        </span>
                      )}
                      <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-transparent text-6xl font-light text-center focus:outline-none text-content-primary w-48"
                        placeholder="0.00"
                        step="0.01"
                        required
                      />
                      {currencyFormat.placement === 'after' && (
                        <span className="text-5xl text-content-secondary font-light ml-2">
                          {currencies.find(c => c.code === currency)?.symbol || '$'}
                        </span>
                      )}
                    </div>
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
                    Will be converted to {formatCurrency(Number(amount) || 0, { ...currencyFormat, currency: globalCurrency })}
                  </div>
                )}
              </div>

              {/* Description input */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-200">
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => {
                            setDescription(suggestion);
                            setShowSuggestions(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Category selector */}
              {type === 'expense' && (
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    id="category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Submit button */}
              <div className="mt-5 sm:mt-6">
                <button
                  type="submit"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:text-sm"
                >
                  Add Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default AddTransactionModal; 