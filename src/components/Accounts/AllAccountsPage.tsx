import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { formatCurrency } from '@/utils/formatters';
import { format, parseISO, isValid } from 'date-fns';

const AllAccountsPage = () => {
  const transactions = useSelector((state: RootState) => state.accounts.transactions);
  const { currencyFormat } = useSelector((state: RootState) => state.budget);
  const categories = useSelector((state: RootState) => state.budget.categories);

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return '—';
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : '—';
  };

  const formatDate = (dateString: string) => {
    try {
      // First try to parse the date string
      const parsedDate = parseISO(dateString);
      
      // Check if the parsed date is valid
      if (!isValid(parsedDate)) {
        console.warn('Invalid date:', dateString);
        return '—';
      }
      
      // Format the valid date
      return format(parsedDate, 'dd.MM.yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return '—';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">All Transactions</h1>
          <p className="mt-2 text-sm text-gray-500">A complete overview of all transactions across all accounts</p>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="min-w-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.type === 'credit' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type === 'credit' ? 'Income' : 'Expense'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(Math.abs(transaction.amount), currencyFormat)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getCategoryName(transaction.categoryId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(transaction.date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllAccountsPage; 
 
 
 
 