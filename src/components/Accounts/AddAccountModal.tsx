import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addAccount } from '../../store/accountSlice';
import { Account, AccountType } from '../../types/account';
import { useAuth } from '../../contexts/AuthContext';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddAccountModal: React.FC<AddAccountModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('checking');
  const [balance, setBalance] = useState('');
  const [institutionName, setInstitutionName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newAccount: Account = {
      id: crypto.randomUUID(),
      name,
      type,
      balance: parseFloat(balance) || 0,
      institutionName: institutionName || undefined,
      userId: user.uid,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(addAccount(newAccount));
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setType('checking');
    setBalance('');
    setInstitutionName('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Account</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Account Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Account Type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as AccountType)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="checking">Checking</option>
              <option value="savings">Savings</option>
              <option value="creditCard">Credit Card</option>
              <option value="cash">Cash</option>
              <option value="lineOfCredit">Line of Credit</option>
              <option value="investment">Investment</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="balance" className="block text-sm font-medium text-gray-700">
              Starting Balance
            </label>
            <input
              type="number"
              id="balance"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              step="0.01"
              required
            />
          </div>

          <div>
            <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
              Institution Name (Optional)
            </label>
            <input
              type="text"
              id="institution"
              value={institutionName}
              onChange={(e) => setInstitutionName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAccountModal; 