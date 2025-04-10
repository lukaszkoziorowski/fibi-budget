import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useCurrency } from '@/hooks/useCurrency';
import { useExchangeRates } from '@/hooks/useExchangeRates';
import { calculateCategoryActivity } from '@/utils/categoryUtils';
import { format } from 'date-fns';
import { formatCurrency } from '@/utils/formatters';

const Report = () => {
  const { transactions, categories } = useSelector((state: RootState) => state.budget);
  const { currencyFormat } = useCurrency();
  const { convertAmount } = useExchangeRates(transactions, currencyFormat.currency);

  // Calculate monthly expenses data
  const monthlyData = React.useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return format(date, 'yyyy-MM');
    }).reverse();

    return last6Months.map(month => {
      const monthlyExpenses = categories.reduce((total, category) => {
        const activity = calculateCategoryActivity(
          category.id,
          transactions,
          month,
          convertAmount
        );
        return total + activity;
      }, 0);

      return {
        month: format(new Date(month), 'MMM yyyy'),
        expenses: monthlyExpenses
      };
    });
  }, [transactions, categories, convertAmount]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Expense Report</h1>
        
        {/* Expenses Trend Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Expenses Trend</h2>
          <div className="h-[400px]" data-testid="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 60,
                  bottom: 20
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  tickFormatter={(value: number) => formatCurrency(value, currencyFormat)}
                  width={80}
                  tickLine={false}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <Tooltip
                  formatter={(value: number) => [
                    formatCurrency(value, currencyFormat),
                    'Expenses'
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#8B5CF6"
                  fill="url(#colorExpenses)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report; 