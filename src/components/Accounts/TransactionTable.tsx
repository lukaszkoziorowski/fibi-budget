import React, { useState, useRef, useEffect } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '@/utils/formatters';
import { Transaction } from '@/store/accountsSlice';
import { CurrencyFormat } from '@/types';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { updateTransaction } from '@/store/accountsSlice';

interface TransactionTableProps {
  transactions: Transaction[];
  currencyFormat: CurrencyFormat;
  onEdit: (transactionId: string) => void;
  onDelete: (transactionId: string) => void;
}

interface EditingCell {
  transactionId: string;
  field: 'amount' | 'description' | 'categoryId';
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  currencyFormat,
  onDelete,
}) => {
  const dispatch = useDispatch();
  const categories = useSelector((state: RootState) => state.budget.categories);
  
  // State for inline editing
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  // Focus the input when editing starts
  useEffect(() => {
    if (editingCell) {
      if (editingCell.field === 'categoryId' && selectRef.current) {
        selectRef.current.focus();
      } else if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [editingCell]);

  const handleStartEditing = (transactionId: string, field: 'amount' | 'description' | 'categoryId', value: string) => {
    setEditingCell({ transactionId, field });
    setEditValue(value);
  };

  const handleSaveEdit = () => {
    if (!editingCell) return;

    const transaction = transactions.find(t => t.id === editingCell.transactionId);
    if (!transaction) return;

    let updatedValue: any = editValue;

    // Convert amount to number if editing amount
    if (editingCell.field === 'amount') {
      const numericValue = parseFloat(editValue);
      if (isNaN(numericValue)) return;
      
      // Preserve the sign (positive/negative) based on transaction type
      updatedValue = transaction.type === 'debit' ? -Math.abs(numericValue) : Math.abs(numericValue);
    }

    // Create a complete transaction update by merging the existing transaction with the updated field
    const updatedTransaction: Transaction = {
      ...transaction,
      [editingCell.field]: updatedValue
    };

    dispatch(updateTransaction(updatedTransaction));

    setEditingCell(null);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
      setEditValue('');
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setEditValue(newValue);
    
    if (!editingCell) return;
    
    const transaction = transactions.find(t => t.id === editingCell.transactionId);
    if (!transaction) return;

    // Create a complete transaction update
    const updatedTransaction: Transaction = {
      ...transaction,
      categoryId: newValue || null
    };

    dispatch(updateTransaction(updatedTransaction));
    setEditingCell(null);
    setEditValue('');
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return '—';
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : '—';
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Seller
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    transaction.type === 'debit'
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {transaction.type === 'debit' ? 'Expense' : 'Income'}
                  </span>
                </td>
                <td 
                  className="px-6 py-4 whitespace-nowrap text-sm text-right cursor-pointer"
                  onClick={() => handleStartEditing(transaction.id, 'amount', Math.abs(transaction.amount).toString())}
                >
                  {editingCell?.transactionId === transaction.id && editingCell.field === 'amount' ? (
                    <input
                      ref={inputRef}
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleSaveEdit}
                      onKeyDown={handleKeyDown}
                      className="w-24 text-right bg-gray-100 rounded px-1 py-0.5"
                      step="0.01"
                      min="0.01"
                    />
                  ) : (
                    <span className={transaction.type === 'debit' ? 'text-red-600' : 'text-green-600'}>
                      {formatCurrency(Math.abs(transaction.amount), currencyFormat)}
                    </span>
                  )}
                </td>
                <td 
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
                  onClick={() => handleStartEditing(transaction.id, 'description', transaction.description)}
                >
                  {editingCell?.transactionId === transaction.id && editingCell.field === 'description' ? (
                    <input
                      ref={inputRef}
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleSaveEdit}
                      onKeyDown={handleKeyDown}
                      className="w-full bg-gray-100 rounded px-1 py-0.5"
                    />
                  ) : (
                    transaction.description
                  )}
                </td>
                <td 
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
                  onClick={() => handleStartEditing(transaction.id, 'categoryId', transaction.categoryId || '')}
                >
                  {editingCell?.transactionId === transaction.id && editingCell.field === 'categoryId' ? (
                    <select
                      ref={selectRef}
                      value={editValue}
                      onChange={handleCategoryChange}
                      onBlur={handleSaveEdit}
                      onKeyDown={handleKeyDown}
                      className="w-full bg-gray-100 rounded px-1 py-0.5"
                    >
                      <option value="">—</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    getCategoryName(transaction.categoryId)
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(transaction.id);
                    }}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="Delete transaction"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable; 
 
 
 
 
 