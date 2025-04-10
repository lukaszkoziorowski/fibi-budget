import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { Account, AccountType } from '../../types/account';
import { deleteAccount } from '../../store/accountSlice';
import { formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../contexts/AuthContext';
import AccountTransactionPage from './AccountTransactionPage';

const accountTypeIcons: Record<AccountType, string> = {
  checking: '🏦',
  savings: '💰',
  creditCard: '💳',
  cash: '💵',
  lineOfCredit: '📝',
  investment: '📈',
  other: '📁',
};

const accountTypeColors: Record<AccountType, string> = {
  checking: 'bg-blue-100 text-blue-800',
  savings: 'bg-green-100 text-green-800',
  creditCard: 'bg-purple-100 text-purple-800',
  cash: 'bg-yellow-100 text-yellow-800',
  lineOfCredit: 'bg-red-100 text-red-800',
  investment: 'bg-indigo-100 text-indigo-800',
  other: 'bg-gray-100 text-gray-800',
};

const Accounts: React.FC = () => {
  const { currentUser } = useAuth();
  const dispatch = useDispatch();
  const accounts = useSelector((state: RootState) => state.accounts.accounts);
  const [selectedType, setSelectedType] = useState<AccountType | 'all'>('all');
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  const filteredAccounts = accounts.filter(account => 
    selectedType === 'all' || account.type === selectedType
  );

  const totalBalance = filteredAccounts.reduce((sum, account) => sum + account.balance, 0);

  const handleDeleteAccount = (accountId: string) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      dispatch(deleteAccount(accountId));
    }
  };

  if (selectedAccountId) {
    return (
      <AccountTransactionPage
        accountId={selectedAccountId}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Accounts</h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as AccountType | 'all')}
            className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="checking">Checking</option>
            <option value="savings">Savings</option>
            <option value="creditCard">Credit Card</option>
            <option value="cash">Cash</option>
            <option value="lineOfCredit">Line of Credit</option>
            <option value="investment">Investment</option>
            <option value="other">Other</option>
          </select>
          <button
            onClick={() => {/* TODO: Open add account modal */}}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Account
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAccounts.map((account) => (
          <div
            key={account.id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => setSelectedAccountId(account.id)}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{accountTypeIcons[account.type]}</span>
                    <h2 className="text-xl font-semibold">{account.name}</h2>
                  </div>
                  {account.institutionName && (
                    <p className="text-gray-600 text-sm mt-1">{account.institutionName}</p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${accountTypeColors[account.type]}`}>
                  {account.type}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Current Balance</p>
                  <p className="text-2xl font-bold">{formatCurrency(account.balance)}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteAccount(account.id);
                  }}
                  className="text-red-500 hover:text-red-700 focus:outline-none"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Total Balance</h3>
          <p className="text-2xl font-bold">{formatCurrency(totalBalance)}</p>
        </div>
      </div>
    </div>
  );
};

export default Accounts; 