import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { updateTransaction } from "@/store/budgetSlice";
import { formatCurrency } from '@/utils/formatters';

interface EditingState {
  id: string | null;
  field: 'date' | 'description' | 'categoryId' | 'type' | 'amount' | null;
}

interface TransactionListProps {
  accountId?: string;
}

const TransactionList: React.FC<TransactionListProps> = ({ accountId }) => {
  const dispatch = useDispatch();
  const transactions = useSelector((state: RootState) => state.budget.transactions);
  const categories = useSelector((state: RootState) => state.budget.categories);
  const { globalCurrency, currencyFormat } = useSelector((state: RootState) => state.budget);
  const [editing, setEditing] = useState<EditingState>({ id: null, field: null });
  const [editValue, setEditValue] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : "Unknown category";
  };

  const handleEdit = (transaction: any, field: EditingState['field']) => {
    setEditing({ id: transaction.id, field });
    switch (field) {
      case 'date':
        setEditValue(transaction.date);
        break;
      case 'description':
        setEditValue(transaction.description);
        break;
      case 'categoryId':
        setEditValue(transaction.categoryId);
        break;
      case 'type':
        setEditValue(transaction.type);
        break;
      case 'amount':
        setEditValue(Math.abs(transaction.amount).toString());
        break;
    }
  };

  const handleSave = (transaction: any) => {
    if (!editing.field) return;

    let newValue = editValue;
    if (editing.field === 'amount') {
      newValue = transaction.type === 'expense' 
        ? (-Math.abs(parseFloat(editValue))).toString()
        : Math.abs(parseFloat(editValue)).toString();
    }

    dispatch(updateTransaction({
      ...transaction,
      [editing.field]: newValue
    }));
    setEditing({ id: null, field: null });
    setEditValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent, transaction: any) => {
    if (e.key === 'Enter') {
      handleSave(transaction);
    } else if (e.key === 'Escape') {
      setEditing({ id: null, field: null });
      setEditValue("");
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl shadow-md bg-white border border-gray-100">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap">
                {editing.id === transaction.id && editing.field === 'date' ? (
                  <input
                    type="date"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleSave(transaction)}
                    onKeyDown={(e) => handleKeyPress(e, transaction)}
                    className="w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={() => handleEdit(transaction, 'date')}
                    className="text-sm text-gray-700 hover:text-purple-600 transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {format(new Date(transaction.date), 'MMM d, yyyy', { locale: enUS })}
                  </button>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editing.id === transaction.id && editing.field === 'description' ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleSave(transaction)}
                    onKeyDown={(e) => handleKeyPress(e, transaction)}
                    className="w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={() => handleEdit(transaction, 'description')}
                    className="text-sm text-gray-700 hover:text-purple-600 transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    {transaction.description}
                  </button>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editing.id === transaction.id && editing.field === 'categoryId' ? (
                  <select
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleSave(transaction)}
                    className="w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    autoFocus
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <button
                    onClick={() => handleEdit(transaction, 'categoryId')}
                    className="text-sm text-gray-600 hover:text-purple-600 transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {categories.find((c) => c.id === transaction.categoryId)?.name}
                  </button>
                )}
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                transaction.type === "income" ? "text-green-600" : "text-red-500"
              }`}>
                {editing.id === transaction.id && editing.field === 'amount' ? (
                  <input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleSave(transaction)}
                    onKeyDown={(e) => handleKeyPress(e, transaction)}
                    className="w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-right"
                    step="0.01"
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={() => handleEdit(transaction, 'amount')}
                    className="hover:opacity-75 w-full text-right flex items-center justify-end"
                  >
                    <svg className={`w-4 h-4 mr-1 ${transaction.type === "income" ? "text-green-500" : "text-red-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {transaction.type === "income" ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                      )}
                    </svg>
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(Math.abs(transaction.amount), currencyFormat)}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;
