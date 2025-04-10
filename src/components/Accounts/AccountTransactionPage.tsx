import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Account, Transaction } from '../../types/account';
import { formatCurrency } from '../../utils/formatters';
import { PlusIcon, ArrowUturnLeftIcon, ArrowUturnRightIcon } from '@heroicons/react/24/outline';
import { createSelector } from '@reduxjs/toolkit';
import AddTransactionModal from '../AddTransactionModal';

interface AccountTransactionPageProps {
  accountId: string;
}

const selectAccounts = (state: RootState) => state.accounts.accounts;
const selectTransactions = (state: RootState) => state.accounts.transactions;

const makeSelectAccount = () => createSelector(
  [selectAccounts, (_state: RootState, accountId: string) => accountId],
  (accounts, accountId) => accounts.find(acc => acc.id === accountId)
);

const makeSelectTransactions = () => createSelector(
  [selectTransactions, (_state: RootState, accountId: string) => accountId],
  (transactions, accountId) => transactions?.filter(t => t.accountId === accountId) || []
);

const AccountTransactionPage: React.FC<AccountTransactionPageProps> = ({ accountId }) => {
  const selectAccount = useMemo(() => makeSelectAccount(), []);
  const selectAccountTransactions = useMemo(() => makeSelectTransactions(), []);
  
  const account = useSelector((state: RootState) => selectAccount(state, accountId));
  const transactions = useSelector((state: RootState) => selectAccountTransactions(state, accountId));
  const { currencyFormat } = useSelector((state: RootState) => state.budget);

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);

  if (!account) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{account.name}</h1>
          {account.notes && (
            <p className="text-sm text-gray-500 mt-1">{account.notes}</p>
          )}
        </div>
      </div>

      {/* Balance Summary */}
      <div className="flex items-center space-x-4 mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex items-center">
          <div className="text-gray-600">
            <span className="text-sm">Current Balance</span>
            <p className="text-lg font-semibold">{formatCurrency(account.balance, currencyFormat)}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end mb-6">
        <div className="flex space-x-4">
          <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
            <ArrowUturnLeftIcon className="h-5 w-5" />
            <span>Undo</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
            <ArrowUturnRightIcon className="h-5 w-5" />
            <span>Redo</span>
          </button>
          <button 
            onClick={() => setIsAddTransactionModalOpen(true)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-[rgb(88,0,159)] hover:bg-[rgb(73,0,132)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(88,0,159)]"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="w-8 px-2 py-3">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payee
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Outflow
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Inflow
              </th>
              <th scope="col" className="w-8 px-2 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-2 py-4 whitespace-nowrap">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.categoryId ? 'Ready to Assign' : ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {transaction.amount < 0 ? formatCurrency(Math.abs(transaction.amount), currencyFormat) : ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {transaction.amount > 0 ? formatCurrency(transaction.amount, currencyFormat) : ''}
                </td>
                <td className="px-2 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddTransactionModalOpen}
        onClose={() => setIsAddTransactionModalOpen(false)}
      />
    </div>
  );
};

export default AccountTransactionPage; 