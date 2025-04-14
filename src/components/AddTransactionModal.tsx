import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { addTransaction } from '@/store/accountsSlice';
import { RootState } from '@/store';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: string;
}

const AddTransactionModal = ({ isOpen, onClose, accountId }: AddTransactionModalProps) => {
  const dispatch = useDispatch();
  const categories = useSelector((state: RootState) => state.budget.categories);
  const { currencyFormat } = useSelector((state: RootState) => state.budget);
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [type, setType] = useState<'debit' | 'credit'>('debit');
  const [errors, setErrors] = useState<{
    amount?: string;
    description?: string;
    categoryId?: string;
  }>({});

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setDescription('');
      setCategoryId('');
      setType('debit');
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (type === 'debit' && !categoryId) {
      newErrors.categoryId = 'Category is required for expenses';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const numericAmount = Number(amount);
    const transactionType = type === 'debit' ? 'debit' : 'credit';

    dispatch(
      addTransaction({
        accountId,
        amount: transactionType === 'debit' ? -numericAmount : numericAmount,
        description: description.trim(),
        categoryId: transactionType === 'debit' ? categoryId : null,
        date: new Date().toISOString(),
        type: transactionType,
        currency: currencyFormat.currency,
        isReconciled: false,
        memo: null
      })
    );

    onClose();
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {};
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog 
        as="div" 
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={onClose}
      >
        <div className="flex items-center justify-center min-h-screen">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-30"
            leave="ease-in duration-300"
            leaveFrom="opacity-30"
            leaveTo="opacity-0"
          >
            <div 
              className="fixed inset-0 bg-black"
              style={{ opacity: 0.3 }}
              onClick={onClose}
            />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-300"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
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
                        onClick={() => setType('debit')}
                        className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                          type === 'debit'
                            ? 'bg-white shadow text-content-primary'
                            : 'text-content-secondary hover:text-content-primary'
                        }`}
                      >
                        Expense
                      </button>
                      <button
                        type="button"
                        onClick={() => setType('credit')}
                        className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                          type === 'credit'
                            ? 'bg-white shadow text-content-primary'
                            : 'text-content-secondary hover:text-content-primary'
                        }`}
                      >
                        Income
                      </button>
                    </div>
                  </div>

                  {/* Amount input */}
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                      Amount
                    </label>
                    <div className="mt-1 relative">
                      <div className="bg-gray-50 rounded-xl p-6 text-center">
                        <div className="relative flex items-center justify-center">
                          <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="bg-transparent text-6xl font-light text-center focus:outline-none text-content-primary w-48"
                            placeholder="0.00"
                            step="0.01"
                            min="0.01"
                          />
                        </div>
                      </div>
                      {errors.amount && (
                        <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                      )}
                    </div>
                  </div>

                  {/* Description input */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      {type === 'debit' ? 'Seller' : 'Payee'}
                    </label>
                    <div className="mt-1 relative">
                      <input
                        type="text"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={`appearance-none block w-full pl-3 pr-10 py-2 text-sm border ${
                          errors.description ? 'border-red-300' : 'border-gray-200'
                        } rounded-md bg-gray-50 min-h-[32px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary`}
                      />
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Category selector */}
                  {type === 'debit' && (
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <div className="mt-1 relative">
                        <select
                          id="category"
                          value={categoryId}
                          onChange={(e) => setCategoryId(e.target.value)}
                          className={`appearance-none block w-full pl-3 pr-10 py-2 text-sm border ${
                            errors.categoryId ? 'border-red-300' : 'border-gray-200'
                          } rounded-md bg-gray-50 min-h-[32px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer`}
                        >
                          <option value="" className="text-gray-500">Select a category</option>
                          {categories.map((category) => (
                            <option 
                              key={category.id} 
                              value={category.id}
                              className="py-2"
                            >
                              {category.name}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                          </svg>
                        </div>
                        {errors.categoryId && (
                          <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Submit button */}
                  <div className="mt-5 sm:mt-6">
                    <button
                      type="submit"
                      className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-[rgb(88,0,159)] text-base font-medium text-white hover:bg-[rgb(73,0,132)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(88,0,159)] sm:text-sm"
                    >
                      Add Transaction
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddTransactionModal;