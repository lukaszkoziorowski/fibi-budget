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

const TransactionList = () => {
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
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-secondary">
        <thead className="bg-background">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-content-secondary uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-content-secondary uppercase tracking-wider">
              Description
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-content-secondary uppercase tracking-wider">
              Category
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-content-secondary uppercase tracking-wider">
              Amount
            </th>
          </tr>
        </thead>
        <tbody className="bg-background divide-y divide-secondary">
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {editing.id === transaction.id && editing.field === 'date' ? (
                  <input
                    type="date"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleSave(transaction)}
                    onKeyDown={(e) => handleKeyPress(e, transaction)}
                    className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={() => handleEdit(transaction, 'date')}
                    className="text-sm text-content-primary hover:opacity-75"
                  >
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
                    className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={() => handleEdit(transaction, 'description')}
                    className="text-sm text-content-primary hover:opacity-75"
                  >
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
                    className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
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
                    className="text-sm text-content-secondary hover:opacity-75"
                  >
                    {categories.find((c) => c.id === transaction.categoryId)?.name}
                  </button>
                )}
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                transaction.type === "income" ? "text-green-600" : "text-red-600"
              }`}>
                {editing.id === transaction.id && editing.field === 'amount' ? (
                  <input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleSave(transaction)}
                    onKeyDown={(e) => handleKeyPress(e, transaction)}
                    className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-primary text-right"
                    step="0.01"
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={() => handleEdit(transaction, 'amount')}
                    className="hover:opacity-75 w-full text-right"
                  >
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
