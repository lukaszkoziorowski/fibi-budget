import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setCurrentMonth } from '@/store/budgetSlice';
import CategoryList from '@/components/CategoryList';
import AddTransactionModal from '@/components/AddTransactionModal';
import { format, addMonths, subMonths, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';

const Dashboard = () => {
  const dispatch = useDispatch();
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [isEditingCategories, setIsEditingCategories] = useState(false);
  const [isMonthSelectorOpen, setIsMonthSelectorOpen] = useState(false);
  
  const { balance, categories, currentMonth: currentMonthString } = useSelector((state: RootState) => state.budget);
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
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <button onClick={handlePreviousMonth} className="btn-ghost p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="relative">
            <button
              onClick={() => setIsMonthSelectorOpen(!isMonthSelectorOpen)}
              className="text-lg font-medium text-content-primary hover:text-content-primary/80"
            >
              {format(currentMonth, 'LLLL yyyy', { locale: enUS })}
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
          <button onClick={handleNextMonth} className="btn-ghost p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-sm text-content-secondary">Ready to Assign:</span>
          <span className={`text-xl font-bold ${availableToAssign >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${availableToAssign.toFixed(2)}
          </span>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setIsEditingCategories(!isEditingCategories)}
            className={isEditingCategories ? 'btn-primary' : 'btn-ghost'}
          >
            {isEditingCategories ? 'Finish Editing' : 'Edit Categories'}
          </button>
          <button
            onClick={() => setIsAddTransactionModalOpen(true)}
            className="btn-primary"
          >
            Add Transaction
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
    </div>
  );
};

export default Dashboard;
