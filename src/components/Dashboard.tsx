import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setCurrentMonth, addCategoryGroup } from '@/store/budgetSlice';
import AddTransactionModal from '@/components/AddTransactionModal';
import { format, addMonths, subMonths, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { formatCurrency } from '@/utils/formatters';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '@/hooks/useCurrency';
import { useBudgetStats } from '@/hooks/useBudgetStats';
import { useModal } from '@/hooks/useModal';
import { ChevronLeftIcon, ChevronRightIcon, ArrowTrendingUpIcon, CurrencyDollarIcon, ShoppingCartIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { UnifiedCategoryTable } from '@/components/UnifiedCategoryTable';
import { Dialog } from '@headlessui/react';

const Dashboard = () => {
  const dispatch = useDispatch();
  useAuth();
  const [] = useState(true);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  
  const { currentMonth: currentMonthString } = useSelector((state: RootState) => state.budget);
  const { currencyFormat } = useCurrency();
  const { assignedTotal, availableToAssign, totalTransactions, totalExpenses } = useBudgetStats();
  
  const addTransactionModal = useModal();
  
  const currentMonth = parseISO(currentMonthString);

  const handlePreviousMonth = () => {
    dispatch(setCurrentMonth(subMonths(currentMonth, 1).toISOString()));
  };

  const handleNextMonth = () => {
    dispatch(setCurrentMonth(addMonths(currentMonth, 1).toISOString()));
  };

  const handleAddGroup = () => {
    if (!groupName.trim()) return;
    dispatch(addCategoryGroup({ name: groupName.trim() }));
    setGroupName('');
    setIsGroupModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-screen-2xl mx-auto px-4 py-8">
        {/* Budget Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8" data-testid="dashboard-cards">
          {/* Ready to Assign */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <CurrencyDollarIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500 font-medium">Ready to Assign</h3>
                <p className="text-xl md:text-2xl font-bold text-gray-800">
                  {formatCurrency(availableToAssign, currencyFormat)}
                </p>
              </div>
            </div>
          </div>
          
          {/* Total Budget */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <ArrowTrendingUpIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500 font-medium">Monthly Budget</h3>
                <p className="text-xl md:text-2xl font-bold text-gray-800">
                  {formatCurrency(assignedTotal, currencyFormat)}
                </p>
              </div>
            </div>
          </div>
          
          {/* Total Transactions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <ShoppingCartIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500 font-medium">Total Transactions</h3>
                <p className="text-xl md:text-2xl font-bold text-gray-800">
                  {totalTransactions}
                </p>
              </div>
            </div>
          </div>
          
          {/* Total Expenses */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <UserGroupIcon className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500 font-medium">Total Expenses</h3>
                <p className="text-xl md:text-2xl font-bold text-gray-800">
                  {formatCurrency(totalExpenses, currencyFormat)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons and Month Selector */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
          {/* Month Selector */}
          <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-gray-200 px-2">
            <button
              onClick={handlePreviousMonth}
              className="p-2 text-gray-500 hover:text-purple-600"
              aria-label="Previous month"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <span className="font-medium text-gray-700 px-2">
              {format(currentMonth, 'MMMM yyyy', { locale: enUS })}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-2 text-gray-500 hover:text-purple-600"
              aria-label="Next month"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={() => addTransactionModal.openModal()}
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-[rgb(88,0,159)] hover:bg-[rgb(73,0,132)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(88,0,159)]"
            >
              Add Transaction
            </button>
            <button
              onClick={() => setIsGroupModalOpen(true)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Add Group
            </button>
          </div>
        </div>

        {/* Main Content */}
        <UnifiedCategoryTable />

        {/* Add Transaction Modal */}
        {addTransactionModal.isOpen && (
          <AddTransactionModal
            isOpen={addTransactionModal.isOpen}
            onClose={addTransactionModal.closeModal}
          />
        )}

        {/* Add Group Modal */}
        <Dialog
          open={isGroupModalOpen}
          onClose={() => setIsGroupModalOpen(false)}
          className="fixed inset-0 z-10 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            <div className="relative bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <button
                onClick={() => setIsGroupModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                aria-label="Close"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <Dialog.Title className="text-lg font-medium text-gray-900 pr-8">
                Add Group
              </Dialog.Title>
              <div className="mt-6">
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
                />
                <div className="mt-6">
                  <button
                    onClick={handleAddGroup}
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-[rgb(88,0,159)] text-base font-medium text-white hover:bg-[rgb(73,0,132)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(88,0,159)] sm:text-sm"
                  >
                    Add Group
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      </main>
    </div>
  );
};

export default Dashboard;

