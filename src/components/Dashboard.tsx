import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setCurrentMonth, clearAllData } from '@/store/budgetSlice';
import CategoryList from '@/components/CategoryList';
import AddTransactionModal from '@/components/AddTransactionModal';
import { format, addMonths, subMonths, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { currencies } from '@/utils/currencies';
import { formatCurrency } from '@/utils/formatters';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const dispatch = useDispatch();
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [isEditingCategories, setIsEditingCategories] = useState(false);
  const [isMonthSelectorOpen, setIsMonthSelectorOpen] = useState(false);
  
  const { balance, categories, currentMonth: currentMonthString, globalCurrency, currencyFormat } = useSelector((state: RootState) => state.budget);
  const currentMonth = parseISO(currentMonthString);
  
  const assignedTotal = categories.reduce((sum, category) => sum + category.budget, 0);
  const availableToAssign = balance - assignedTotal;

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
      <main className="container mx-auto px-4 py-8">
        {/* Budget Controls */}
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousMonth}
              className="p-2 rounded-lg hover:bg-surface-hover transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5 text-content-primary" />
            </button>
            <div className="relative">
              <button
                onClick={() => setIsMonthSelectorOpen(!isMonthSelectorOpen)}
                className="text-lg font-medium text-content-primary hover:text-content-secondary transition-colors"
              >
                {format(currentMonth, 'MMMM yyyy', { locale: enUS })}
              </button>
              {isMonthSelectorOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg py-2 z-10">
                  {monthOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        dispatch(setCurrentMonth(option.value));
                        setIsMonthSelectorOpen(false);
                      }}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg hover:bg-surface-hover transition-colors"
            >
              <ChevronRightIcon className="w-5 h-5 text-content-primary" />
            </button>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-sm text-content-secondary">Ready to Assign:</span>
            <span className={`text-xl font-bold ${availableToAssign >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(Math.abs(availableToAssign), currencyFormat)}
            </span>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setIsEditingCategories(!isEditingCategories)}
              className="btn-primary"
            >
              {isEditingCategories ? 'Finish Editing' : 'Edit Categories'}
            </button>
            <button
              onClick={() => setIsAddTransactionModalOpen(true)}
              className="btn-primary"
            >
              Add Transaction
            </button>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to reset all data? This will clear all transactions but restore default categories.')) {
                  dispatch(clearAllData());
                  window.location.reload();
                }
              }}
              className="btn-ghost text-red-600 hover:text-red-700"
            >
              Reset Data
            </button>
          </div>
        </div>

        {/* Budget overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Ready to Assign</h2>
            <div className="text-3xl font-light text-content-primary">
              {formatCurrency(balance, currencyFormat)}
            </div>
            <div className="mt-2 text-sm text-content-secondary">
              Total available: {formatCurrency(availableToAssign, currencyFormat)}
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Monthly Budget</h2>
            <div className="text-3xl font-light text-content-primary">
              {formatCurrency(assignedTotal, currencyFormat)}
            </div>
            <div className="mt-2 text-sm text-content-secondary">
              Total assigned: {formatCurrency(assignedTotal, currencyFormat)}
            </div>
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
