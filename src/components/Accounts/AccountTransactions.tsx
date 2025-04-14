import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { formatCurrency } from '../../utils/formatters';

interface AccountTransactionsProps {
  accountId: string;
  onBack: () => void;
}

const AccountTransactions: React.FC<AccountTransactionsProps> = ({ accountId, onBack }) => {
  const account = useSelector((state: RootState) => 
    state.accounts.accounts.find(acc => acc.id === accountId)
  );

  if (!account) {
    return null;
  }

  const clearedBalance = account.balance;
  const unreconciled = useSelector((state: RootState) =>
    state.accounts.transactions
      .filter(t => t.accountId === accountId && !t.isReconciled)
      .reduce((sum, t) => sum + t.amount, 0)
  );
  const workingBalance = clearedBalance + unreconciled;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-4 text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold">{account.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500">Cleared Balance</h3>
          <p className="text-2xl font-bold mt-1">{formatCurrency(clearedBalance)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500">Uncleared Balance</h3>
          <p className="text-2xl font-bold mt-1">{formatCurrency(unreconciled)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500">Working Balance</h3>
          <p className="text-2xl font-bold mt-1">{formatCurrency(workingBalance)}</p>
        </div>
      </div>
    </div>
  );
};

export default AccountTransactions; 
 
 
 
 
 
 