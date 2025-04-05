import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setCurrentMonth } from '@/store/budgetSlice';
import CategoryList from '@/components/CategoryList';
import AddTransactionModal from '@/components/AddTransactionModal';
import AddCategoryModal from '@/components/AddCategoryModal';
import { format, addMonths, subMonths, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { formatCurrency } from '@/utils/formatters';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '@/hooks/useCurrency';
import { useBudgetStats } from '@/hooks/useBudgetStats';
import { useModal } from '@/hooks/useModal';
import { ChevronLeftIcon, ChevronRightIcon, BellIcon, ArrowTrendingUpIcon, CurrencyDollarIcon, ShoppingCartIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const DEFAULT_CURRENCY_FORMAT = {
  currency: 'USD',
  placement: 'before' as const,
  numberFormat: '123,456.78',
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const [isEditingCategories, setIsEditingCategories] = useState(false);
  
  const { currentMonth: currentMonthString } = useSelector((state: RootState) => state.budget);
  const { currencyFormat } = useCurrency();
  const { balance, assignedTotal, availableToAssign, totalTransactions, totalExpenses } = useBudgetStats();
  
  const addTransactionModal = useModal();
  const addCategoryModal = useModal();
  
  const currentMonth = parseISO(currentMonthString);

  const handlePreviousMonth = () => {
    dispatch(setCurrentMonth(subMonths(currentMonth, 1).toISOString()));
  };

  const handleNextMonth = () => {
    dispatch(setCurrentMonth(addMonths(currentMonth, 1).toISOString()));
  };

  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(currentMonth.getFullYear(), i, 1);
    return {
      value: date.toISOString(),
      label: format(date, 'LLLL', { locale: enUS }),
    };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-screen-2xl mx-auto px-4 py-8">
        {/* Budget Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Ready to Assign */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-all duration-300">
                <CurrencyDollarIcon className="w-6 h-6 text-purple-600 animate-pulse group-hover:animate-none transition-all duration-300" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500 font-medium">Ready to Assign</h3>
                <p className="text-2xl font-bold text-gray-800 group-hover:text-purple-700 transition-colors duration-300">
                  {formatCurrency(availableToAssign, currencyFormat)}
                </p>
              </div>
            </div>
          </div>
          
          {/* Total Budget */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-all duration-300">
                <ArrowTrendingUpIcon className="w-6 h-6 text-blue-600 transition-all duration-300" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500 font-medium">Monthly Budget</h3>
                <p className="text-2xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                  {formatCurrency(assignedTotal, currencyFormat)}
                </p>
              </div>
            </div>
          </div>
          
          {/* Total Transactions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center group-hover:bg-yellow-200 transition-all duration-300">
                <ShoppingCartIcon className="w-6 h-6 text-yellow-600 transition-all duration-300" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500 font-medium">Total Transactions</h3>
                <p className="text-2xl font-bold text-gray-800 group-hover:text-yellow-700 transition-colors duration-300">
                  {totalTransactions}
                </p>
              </div>
            </div>
          </div>
          
          {/* Total Expenses */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-all duration-300">
                <UserGroupIcon className="w-6 h-6 text-red-600 transition-all duration-300" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500 font-medium">Total Expenses</h3>
                <p className="text-2xl font-bold text-gray-800 group-hover:text-red-700 transition-colors duration-300">
                  {formatCurrency(totalExpenses, currencyFormat)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons and Month Selector */}
      <div className="flex justify-between items-center mb-8">
          {/* Month Selector */}
          <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-gray-200 px-2">
            <button
              onClick={handlePreviousMonth}
              className="p-2 text-gray-500 hover:text-purple-600 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <span className="font-medium text-gray-700 px-2">
              {format(currentMonth, 'MMMM yyyy', { locale: enUS })}
            </span>
                  <button
              onClick={handleNextMonth}
              className="p-2 text-gray-500 hover:text-purple-600 transition-colors"
              aria-label="Next month"
            >
              <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
          <button
              onClick={() => addCategoryModal.openModal()}
              className="inline-flex items-center px-4 py-2 border border-[rgb(88,0,159)] text-sm font-medium rounded-lg shadow-sm text-[rgb(88,0,159)] hover:bg-purple-50"
          >
              Add Category
          </button>
          <button
            onClick={() => addTransactionModal.openModal()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-[rgb(88,0,159)] hover:bg-[rgb(73,0,132)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(88,0,159)] transition-all"
          >
            Add Transaction
          </button>
        </div>
      </div>

      {/* Main Content */}
      <CategoryList isEditing={isEditingCategories} />

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={addTransactionModal.isOpen}
        onClose={addTransactionModal.closeModal}
      />

        {/* Add Category Modal */}
        <AddCategoryModal
          isOpen={addCategoryModal.isOpen}
          onClose={addCategoryModal.closeModal}
        />
      </main>
    </div>
  );
};

export default Dashboard;

