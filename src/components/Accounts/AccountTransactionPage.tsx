import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { formatCurrency } from '../../utils/formatters';
import { PlusIcon } from '@heroicons/react/24/outline';
import { createSelector } from '@reduxjs/toolkit';
import AddTransactionModal from '../AddTransactionModal';
import TransactionTable from './TransactionTable';
import { deleteTransaction } from '../../store/accountsSlice';

interface AccountTransactionPageProps {
  accountId: string;
}

const selectAccounts = (state: RootState) => state.accounts.accounts;
const selectTransactions = (state: RootState) => state.accounts.transactions || [];

const makeSelectAccount = () => createSelector(
  [selectAccounts, (_state: RootState, accountId: string) => accountId],
  (accounts, accountId) => accounts.find(acc => acc.id === accountId)
);

const makeSelectAccountTransactions = () => createSelector(
  [selectTransactions, (_state: RootState, accountId: string) => accountId],
  (transactions, accountId) => transactions.filter(t => t.accountId === accountId)
);

const AccountTransactionPage: React.FC<AccountTransactionPageProps> = ({ accountId }) => {
  const dispatch = useDispatch();
  const selectAccount = useMemo(() => makeSelectAccount(), []);
  const selectAccountTransactions = useMemo(() => makeSelectAccountTransactions(), []);
  
  const account = useSelector((state: RootState) => selectAccount(state, accountId));
  const transactions = useSelector((state: RootState) => selectAccountTransactions(state, accountId));
  const { currencyFormat } = useSelector((state: RootState) => state.budget);

  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);

  if (!account) {
    return null;
  }

  const handleEditTransaction = (transactionId: string) => {
    // TODO: Implement edit functionality when AddTransactionModal supports editing
    console.log('Edit transaction:', transactionId);
    setIsAddTransactionModalOpen(true);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    dispatch(deleteTransaction(transactionId));
  };

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
        <button 
          onClick={() => setIsAddTransactionModalOpen(true)}
          className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-[rgb(88,0,159)] hover:bg-[rgb(73,0,132)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(88,0,159)]"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Transaction
        </button>
      </div>

      {/* Transactions Table */}
      <TransactionTable
        transactions={transactions}
        currencyFormat={currencyFormat}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
      />

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddTransactionModalOpen}
        onClose={() => setIsAddTransactionModalOpen(false)}
        accountId={accountId}
      />
    </div>
  );
};

export default AccountTransactionPage; 