import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addCategory, deleteCategory, updateCategory } from '@/store/budgetSlice';

interface CategoryListProps {
  isEditing: boolean;
}

const CategoryList = ({ isEditing }: CategoryListProps) => {
  const dispatch = useDispatch();
  const categories = useSelector((state: RootState) => state.budget.categories);
  const transactions = useSelector((state: RootState) => state.budget.transactions);
  
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingBudget, setEditingBudget] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    dispatch(
      addCategory({
        id: Date.now().toString(),
        name: newCategoryName.trim(),
        budget: 0,
      })
    );
    setNewCategoryName('');
  };

  const handleUpdateCategory = (id: string) => {
    if (!editingName.trim()) return;
    const category = categories.find((c) => c.id === id);
    if (!category) return;
    
    dispatch(updateCategory({
      id,
      name: editingName.trim(),
      budget: Number(editingBudget) || category.budget,
    }));
    setEditingId(null);
    setEditingName('');
    setEditingBudget('');
  };

  const handleRemoveCategory = (id: string) => {
    const hasTransactions = transactions.some((t) => t.categoryId === id);
    if (hasTransactions) {
      alert('Cannot delete a category that has transactions assigned to it.');
      return;
    }
    dispatch(deleteCategory(id));
  };

  const calculateCategoryActivity = (categoryId: string) => {
    return transactions
      .filter((t) => t.categoryId === categoryId && t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  };

  const handleStartEditing = (category: { id: string; name: string; budget: number }) => {
    setEditingId(category.id);
    setEditingName(category.name);
    setEditingBudget(category.budget.toString());
  };

  const handleBudgetChange = (category: { id: string; name: string; budget: number }, newBudget: string) => {
    dispatch(updateCategory({
      ...category,
      budget: Number(newBudget) || 0,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Categories list */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-content-secondary uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-content-secondary uppercase tracking-wider">
                Assigned
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-content-secondary uppercase tracking-wider">
                Activity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-content-secondary uppercase tracking-wider">
                Remaining
              </th>
              {isEditing && (
                <th className="px-6 py-3 text-left text-xs font-medium text-content-secondary uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => {
              const isEditing = editingId === category.id;
              const activity = calculateCategoryActivity(category.id);
              const remaining = category.budget - activity;

              return (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="input-primary"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleUpdateCategory(category.id);
                          }
                        }}
                        autoFocus
                      />
                    ) : (
                      <div className="text-sm font-medium text-content-primary">
                        {category.name}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editingBudget}
                        onChange={(e) => setEditingBudget(e.target.value)}
                        className="input-primary w-24"
                        step="0.01"
                      />
                    ) : (
                      <input
                        type="number"
                        value={category.budget}
                        onChange={(e) => handleBudgetChange(category, e.target.value)}
                        className="input-primary w-24"
                        step="0.01"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-content-secondary">
                      ${activity.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-content-secondary">
                      ${remaining.toFixed(2)}
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          remaining < 0
                            ? 'bg-red-600'
                            : remaining < category.budget * 0.2
                            ? 'bg-yellow-600'
                            : 'bg-green-600'
                        }`}
                        style={{
                          width: `${Math.min(
                            (activity / category.budget) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </td>
                  {isEditing && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-content-secondary">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateCategory(category.id)}
                            className="btn-primary"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditingName('');
                              setEditingBudget('');
                            }}
                            className="btn-ghost"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStartEditing(category)}
                            className="btn-ghost"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleRemoveCategory(category.id)}
                            className="btn-danger"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add category form */}
      {isEditing && (
        <form onSubmit={handleAddCategory} className="mt-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="New category name"
              className="input-primary flex-grow"
            />
            <button type="submit" className="btn-primary">
              Add Category
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CategoryList;
