import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { updateTransaction } from "@/store/budgetSlice";

interface EditingState {
  id: string | null;
  field: 'date' | 'description' | 'categoryId' | 'type' | 'amount' | null;
}

const TransactionList = () => {
  const dispatch = useDispatch();
  const { transactions, categories } = useSelector((state: RootState) => state.budget);
  const [editing, setEditing] = useState<EditingState>({ id: null, field: null });
  const [editValue, setEditValue] = useState("");
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
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Seller
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                    className="hover:text-primary"
                  >
                    {format(new Date(transaction.date), "MMM d, yyyy", { locale: enUS })}
                  </button>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
                    className="hover:text-primary text-left w-full"
                  >
                    {transaction.description}
                  </button>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                    className="hover:text-primary"
                  >
                    {getCategoryName(transaction.categoryId)}
                  </button>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {editing.id === transaction.id && editing.field === 'type' ? (
                  <select
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleSave(transaction)}
                    className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    autoFocus
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                ) : (
                  <button
                    onClick={() => handleEdit(transaction, 'type')}
                    className="hover:text-primary"
                  >
                    {transaction.type === 'income' ? 'Income' : 'Expense'}
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
                    {Math.abs(transaction.amount).toLocaleString("en-US", { style: "currency", currency: "USD" })}
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
