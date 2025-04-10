import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { Transaction } from '../../types/account';
import { addTransaction, deleteTransaction } from '../../store/accountSlice';
import { formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../contexts/AuthContext';

interface TransactionListProps {
  accountId: string;
}

const TransactionList: React.FC<TransactionListProps> = ({ accountId }) => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const transactions = useSelector((state: RootState) => 
    state.accounts.transactions.filter(t => t.accountId === accountId)
  );
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const transaction: Transaction = {
      id: crypto.randomUUID(),
      accountId,
      amount: parseFloat(newTransaction.amount),
      description: newTransaction.description,
      date: newTransaction.date,
      userId: user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(addTransaction(transaction));
    setIsAddingTransaction(false);
    setNewTransaction({
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleDeleteTransaction = (transactionId: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      dispatch(deleteTransaction(transactionId));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Transactions</h3>
        <button
          onClick={() => setIsAddingTransaction(true)}
          className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
        >
          + Add Transaction
        </button>
      </div>

      {isAddingTransaction && (
        <form onSubmit={handleAddTransaction} className="space-y-4 bg-gray-50 p-4 rounded-lg">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              step="0.01"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              id="description"
              value={newTransaction.description}
              onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={newTransaction.date}
              onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsAddingTransaction(false)}
              className="px-3 py-1 text-sm text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm"
          >
            <div>
              <p className="font-medium">{transaction.description}</p>
              <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`font-semibold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(transaction.amount)}
              </span>
              <button
                onClick={() => handleDeleteTransaction(transaction.id)}
                className="text-red-500 hover:text-red-700 focus:outline-none"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList; 