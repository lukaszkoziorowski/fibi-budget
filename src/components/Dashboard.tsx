import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setCurrentMonth, clearAllData } from '@/store/budgetSlice';
import CategoryList from '@/components/CategoryList';
import AddTransactionModal from '@/components/AddTransactionModal';
import { format, addMonths, subMonths, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { currencies } from '@/utils/currencies';
import { formatCurrency } from '@/utils/formatters';
import { useAuth } from '../contexts/AuthContext';
import { ChevronLeftIcon, ChevronRightIcon, BellIcon, ArrowTrendingUpIcon, CurrencyDollarIcon, ShoppingCartIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [isEditingCategories] = useState(true);
  const [isMonthSelectorOpen, setIsMonthSelectorOpen] = useState(false);
  
  const { balance, categories, transactions, currentMonth: currentMonthString, globalCurrency, currencyFormat } = useSelector((state: RootState) => state.budget);
  const currentMonth = parseISO(currentMonthString);
  
  const assignedTotal = categories.reduce((sum, category) => sum + category.budget, 0);
  const availableToAssign = balance - assignedTotal;

  // Calculate total transactions count
  const totalTransactions = transactions.length;
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);

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
            <div className="flex items-center gap-3 mb-4">
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
            <div className="flex items-center">
              <span className={`inline-block h-3 w-3 rounded-full ${availableToAssign >= 0 ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
              <span className="text-sm text-gray-600">{availableToAssign >= 0 ? '+' : ''}{formatCurrency(availableToAssign, currencyFormat)}</span>
            </div>
          </div>
          
          {/* Total Budget */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md group">
            <div className="flex items-center gap-3 mb-4">
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
            <div className="flex items-center">
              <span className="inline-block h-3 w-3 rounded-full bg-blue-500 mr-2"></span>
              <span className="text-sm text-gray-600">Total assigned</span>
            </div>
          </div>
          
          {/* Total Transactions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md group">
            <div className="flex items-center gap-3 mb-4">
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
            <div className="flex items-center">
              <span className="inline-block h-3 w-3 rounded-full bg-yellow-500 mr-2"></span>
              <span className="text-sm text-gray-600">This month</span>
            </div>
          </div>
          
          {/* Total Expenses */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md group">
            <div className="flex items-center gap-3 mb-4">
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
            <div className="flex items-center">
              <span className="inline-block h-3 w-3 rounded-full bg-red-500 mr-2"></span>
              <span className="text-sm text-gray-600">This month</span>
            </div>
          </div>
        </div>

        {/* Action Buttons and Month Selector */}
        <div className="flex justify-between items-center mb-8">
          {/* Month Selector */}
          <div className="relative">
            <button 
              onClick={() => setIsMonthSelectorOpen(!isMonthSelectorOpen)} 
              className="flex items-center text-gray-700 hover:text-purple-600 transition-colors px-4 py-2 hover:bg-gray-100 rounded-lg shadow-sm border border-gray-200"
            >
              <span className="font-medium">{format(currentMonth, 'MMMM yyyy', { locale: enUS })}</span>
              <ChevronRightIcon className={`w-4 h-4 ml-2 transition-transform duration-200 ${isMonthSelectorOpen ? 'rotate-90' : ''}`} />
            </button>
            
            {isMonthSelectorOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl py-2 z-10 border border-gray-100 min-w-[200px]">
                <div className="flex px-4 py-2 border-b border-gray-100">
                  <button onClick={handlePreviousMonth} className="p-1 hover:bg-gray-100 rounded">
                    <ChevronLeftIcon className="w-4 h-4" />
                  </button>
                  <div className="flex-1 text-center font-medium">{format(currentMonth, 'MMMM yyyy', { locale: enUS })}</div>
                  <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded">
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>
                {monthOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      dispatch(setCurrentMonth(option.value));
                      setIsMonthSelectorOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700 hover:text-purple-600 transition-colors"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setIsAddTransactionModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-colors shadow-md border border-purple-600 flex items-center gap-2 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Transaction
            </button>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to reset all data? This will clear all transactions but restore default categories.')) {
                  dispatch(clearAllData());
                  window.location.reload();
                }
              }}
              className="px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors shadow-md border border-red-200 flex items-center gap-2 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Reset Data
            </button>
          </div>
        </div>

        {/* Main Content */}
        <CategoryList isEditing={isEditingCategories} />

        {/* Add Transaction Modal */}
        <AddTransactionModal
          isOpen={isAddTransactionModalOpen}
          onClose={() => setIsAddTransactionModalOpen(false)}
        />
      </main>
    </div>
  );
};

export default Dashboard;

