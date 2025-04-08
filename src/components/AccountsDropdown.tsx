import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { addAccount, setActiveAccount } from '@/store/accountsSlice';
import { BanknotesIcon, PlusIcon, ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '@/utils/formatters';
import type { Account } from '@/store/accountsSlice';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface AccountsDropdownProps {
  isCollapsed: boolean;
}

const AccountsDropdown = ({ isCollapsed }: AccountsDropdownProps) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountType, setNewAccountType] = useState<Account['type']>('checking');
  const [newAccountBalance, setNewAccountBalance] = useState('0');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const accounts = useSelector((state: RootState) => state.accounts.accounts);
  const activeAccountId = useSelector((state: RootState) => state.accounts.activeAccountId);
  const { globalCurrency, currencyFormat } = useSelector((state: RootState) => state.budget);

  // Get active account or default to first account
  const activeAccount = activeAccountId 
    ? accounts.find(a => a.id === activeAccountId) 
    : accounts.length > 0 ? accounts[0] : null;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close if the modal is open
      if (showAddForm) return;
      
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAddForm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAccountName.trim()) return;
    
    const balance = parseFloat(newAccountBalance) || 0;
    
    dispatch(addAccount({
      name: newAccountName.trim(),
      type: newAccountType,
      balance,
      currency: globalCurrency,
      color: '#9333ea', // Default purple
      isHidden: false
    }));
    
    // Reset form
    setNewAccountName('');
    setNewAccountType('checking');
    setNewAccountBalance('0');
    setShowAddForm(false);
  };

  // Handle clicking the Add Account button
  const handleShowAddForm = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setShowAddForm(true);
  };

  const getAccountIcon = (_type?: string) => {
    return <BanknotesIcon className="w-5 h-5" />;
  };

  const renderDropdownContent = () => {
    return (
      <>
        {accounts.map(account => (
          <button
            key={account.id}
            onClick={() => {
              dispatch(setActiveAccount(account.id));
              setIsOpen(false);
            }}
            className={`flex items-center w-full px-4 py-2 text-sm ${
              activeAccount?.id === account.id 
                ? 'bg-purple-50 text-purple-700' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="mr-2">{getAccountIcon(account.type)}</span>
            <span className="flex-1 text-left">{account.name}</span>
            <span>{formatCurrency(account.balance, currencyFormat)}</span>
          </button>
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
      <div className="mb-2">
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
          <div ref={dropdownRef}>
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
              <div className="mt-1 pl-10 pr-2">
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
          className="relative z-[100]"
          onClose={() => setShowAddForm(false)}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={(e) => e.stopPropagation()} />
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-300"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel 
                  ref={formRef}
                  className="w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
                    <Dialog.Title className="text-base font-medium text-gray-900">
                      Add New Account
                    </Dialog.Title>
                    <button 
                      onClick={() => setShowAddForm(false)}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded-md"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="px-4 py-4 space-y-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={newAccountName}
                        onChange={(e) => setNewAccountName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                        placeholder="e.g. Checking Account"
                        autoFocus
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Type</label>
                      <select
                        value={newAccountType}
                        onChange={(e) => setNewAccountType(e.target.value as Account['type'])}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm text-white bg-purple-600 rounded-md hover:bg-purple-700"
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
    </>
  );
};

export default AccountsDropdown; 