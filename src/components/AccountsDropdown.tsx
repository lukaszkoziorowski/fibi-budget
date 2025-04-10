import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/store';
import { addAccount, setActiveAccount, updateAccount, deleteAccount } from '@/store/accountsSlice';
import { BanknotesIcon, PlusIcon, ChevronDownIcon, XMarkIcon, PencilIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '@/utils/formatters';
import type { Account } from '@/store/accountsSlice';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface AccountsDropdownProps {
  isCollapsed: boolean;
}

const AccountsDropdown = ({ isCollapsed }: AccountsDropdownProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingNotes, setEditingNotes] = useState('');
  const [editingBalance, setEditingBalance] = useState('');
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountType, setNewAccountType] = useState<Account['type']>('checking');
  const [newAccountBalance, setNewAccountBalance] = useState('0');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const accounts = useSelector((state: RootState) => state.accounts.accounts);
  const activeAccountId = useSelector((state: RootState) => state.accounts.activeAccountId);
  const { currencyFormat, globalCurrency } = useSelector((state: RootState) => state.budget);

  // Get active account or default to first account
  const activeAccount = activeAccountId 
    ? accounts.find(a => a.id === activeAccountId) 
    : accounts.length > 0 ? accounts[0] : null;

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>, account: Account) => {
    e.stopPropagation();
    setEditingAccount(account);
    setEditingName(account.name);
    setEditingNotes(account.notes || '');
    setEditingBalance(account.balance.toString());
    setShowEditForm(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccount) return;

    const updatedAccount = {
      ...editingAccount,
      name: editingName.trim(),
      notes: editingNotes.trim() || null,
      balance: parseFloat(editingBalance) || 0,
      updatedAt: new Date().toISOString()
    };

    dispatch(updateAccount(updatedAccount));
    setShowEditForm(false);
    setEditingAccount(null);
  };

  const handleDeleteAccount = () => {
    if (!editingAccount) return;
    
    dispatch(deleteAccount(editingAccount.id));
    setShowEditForm(false);
    setEditingAccount(null);
    
    // If we're deleting the active account, navigate back to the dashboard
    if (activeAccountId === editingAccount.id) {
      navigate('/');
    }
  };

  const handleShowAddForm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowAddForm(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAccountName.trim()) return;
    
    const balance = parseFloat(newAccountBalance) || 0;
    
    dispatch(addAccount({
      name: newAccountName.trim(),
      type: newAccountType,
      balance,
      currency: globalCurrency,
      color: '#9333ea', // Default purple
      isHidden: false,
      updatedAt: new Date().toISOString()
    }));
    
    // Reset form
    setNewAccountName('');
    setNewAccountType('checking');
    setNewAccountBalance('0');
    setShowAddForm(false);
  };

  const renderDropdownContent = () => {
    return (
      <>
        {accounts.map(account => (
          <div
            key={account.id}
            className="group relative"
          >
            <button
              onClick={() => {
                dispatch(setActiveAccount(account.id));
                navigate(`/accounts/${account.id}`);
              }}
              className={`flex items-center w-full px-4 py-2 text-sm ${
                activeAccount?.id === account.id 
                  ? 'bg-purple-50 text-purple-700' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <button
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleEditClick(e, account)}
                className="opacity-0 group-hover:opacity-100 transition-opacity absolute left-2 p-1 hover:bg-gray-100 rounded"
              >
                <PencilIcon className="w-4 h-4 text-gray-500" />
              </button>
              <span className="flex-1 text-left pl-7 truncate">{account.name}</span>
              <span className="flex-shrink-0 ml-2">{formatCurrency(account.balance, currencyFormat)}</span>
            </button>
          </div>
        ))}
        
        <div className="border-t border-gray-100 my-1"></div>
        
        <button
          onClick={handleShowAddForm}
          className="flex items-center w-full px-4 py-2 text-sm text-purple-600 hover:bg-gray-50"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Account
        </button>
      </>
    );
  };

  return (
    <>
      <div className="mb-2 w-full">
        {isCollapsed ? (
          <>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-center w-full h-10 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <BanknotesIcon className="w-5 h-5" />
              </div>
            </button>
            
            {isOpen && (
              <div 
                ref={dropdownRef}
                className="absolute left-16 z-20 mt-2 w-56 bg-white rounded-md shadow-lg py-1"
              >
                {renderDropdownContent()}
              </div>
            )}
          </>
        ) : (
          <div ref={dropdownRef} className="w-full">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-between w-full px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 flex items-center justify-center">
                  <BanknotesIcon className="w-5 h-5" />
                </div>
                <span className="ml-2 font-medium">Accounts</span>
              </div>
              <ChevronDownIcon 
                className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
              />
            </button>
            
            {isOpen && (
              <div className="mt-1 w-full">
                {renderDropdownContent()}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Account Modal */}
      <Transition appear show={showAddForm} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-50"
          onClose={() => setShowAddForm(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
                    <Dialog.Title className="text-base font-medium text-gray-900">
                      Add New Account
                    </Dialog.Title>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleAddSubmit} className="p-4 space-y-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={newAccountName}
                        onChange={(e) => setNewAccountName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="e.g. Checking Account"
                        autoFocus
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Type</label>
                      <select
                        value={newAccountType}
                        onChange={(e) => setNewAccountType(e.target.value as Account['type'])}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="checking">Checking</option>
                        <option value="savings">Savings</option>
                        <option value="credit">Credit Card</option>
                        <option value="investment">Investment</option>
                        <option value="cash">Cash</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Balance</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newAccountBalance}
                        onChange={(e) => setNewAccountBalance(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 rounded-md"
                      >
                        Add Account
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Edit Account Modal */}
      <Transition appear show={showEditForm} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowEditForm(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
                    <Dialog.Title className="text-base font-medium text-gray-900">
                      Edit Account
                    </Dialog.Title>
                    <button
                      onClick={() => setShowEditForm(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleEditSubmit} className="p-4 space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Account Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Account Nickname</label>
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Account Notes</label>
                          <textarea
                            value={editingNotes}
                            onChange={(e) => setEditingNotes(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Working Balance</h3>
                      <div>
                        <input
                          type="number"
                          value={editingBalance}
                          onChange={(e) => setEditingBalance(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          An adjustment transaction will be created automatically if you change this amount.
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <button
                        type="button"
                        onClick={handleDeleteAccount}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Delete Account
                      </button>
                      <div className="space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowEditForm(false)}
                          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 rounded-md"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 rounded-md"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default AccountsDropdown; 