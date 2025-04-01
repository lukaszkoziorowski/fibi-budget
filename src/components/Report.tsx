import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { enUS } from 'date-fns/locale';

const Report = () => {
  const { transactions } = useSelector((state: RootState) => state.budget);

  // Get transactions from last 6 months
  const getMonthlyData = () => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(now, i));
      const monthEnd = endOfMonth(monthStart);
      
      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= monthStart && transactionDate <= monthEnd;
      });

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      months.push({
        month: format(monthStart, 'MMMM yyyy', { locale: enUS }),
        income,
        expenses,
      });
    }

    return months;
  };

  const monthlyData = getMonthlyData();
  const maxAmount = Math.max(
    ...monthlyData.map(m => Math.max(m.income, m.expenses))
  );

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Financial Report</h2>
        <div className="space-y-6">
          {monthlyData.map((data) => {
            const incomePercentage = (data.income / maxAmount) * 100;
            const expensesPercentage = (data.expenses / maxAmount) * 100;

            return (
              <div key={data.month} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">{data.month}</span>
                  <div className="flex gap-4">
                    <span className="text-sm text-green-600">
                      +${data.income.toFixed(2)}
                    </span>
                    <span className="text-sm text-red-600">
                      -${data.expenses.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div className="flex h-full">
                    <div
                      className="bg-green-500"
                      style={{ width: `${incomePercentage}%` }}
                    />
                    <div
                      className="bg-red-500"
                      style={{ width: `${expensesPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Report; 