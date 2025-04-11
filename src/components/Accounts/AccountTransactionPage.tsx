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

  // Calculate totals
  const totalIncome = useMemo(() => {
    const creditTransactions = transactions.filter(t => t.type === 'credit');
    return creditTransactions.reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalExpenses = useMemo(() => {
    const debitTransactions = transactions.filter(t => t.type === 'debit');
    return debitTransactions.reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const workingBalance = account.balance;
  const currentBalance = workingBalance + totalIncome - Math.abs(totalExpenses);

  // Use absolute value for display purposes
  const displayExpenses = Math.abs(totalExpenses);

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
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Balance Calculation</h2>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Working Balance:</span>
            <span className="font-medium">{formatCurrency(workingBalance, currencyFormat)}</span>
          </div>
          <div className="flex justify-between items-center text-green-600">
            <span>Total Income:</span>
            <span className="font-medium">+{formatCurrency(totalIncome, currencyFormat)}</span>
          </div>
          <div className="flex justify-between items-center text-red-600">
            <span>Total Expenses:</span>
            <span className="font-medium">-{formatCurrency(displayExpenses, currencyFormat)}</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Current Balance:</span>
              <span className="font-bold text-lg">{formatCurrency(currentBalance, currencyFormat)}</span>
            </div>
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