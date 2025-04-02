import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import { currencies } from '@/utils/currencies';
import { getExchangeRate } from '@/utils/currencies';
import { formatCurrency } from '@/utils/formatters';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const Report = () => {
  const { transactions, globalCurrency, currencyFormat } = useSelector((state: RootState) => state.budget);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const currencySymbol = currencies.find(c => c.code === globalCurrency)?.symbol || '$';

  // Fetch exchange rates for all currencies used in transactions
  useEffect(() => {
    const fetchRates = async () => {
      const uniqueCurrencies = new Set(transactions.map(t => t.originalCurrency || t.currency));
      const rates: Record<string, number> = {};
      
      for (const currency of uniqueCurrencies) {
        if (currency !== globalCurrency) {
          rates[currency] = await getExchangeRate(currency, globalCurrency);
        }
      }
      
      setExchangeRates(rates);
    };

    fetchRates();
  }, [transactions, globalCurrency]);

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
        .reduce((sum, t) => {
          let amount = t.amount;
          // Convert amount if it's in a different currency
          if (t.originalAmount && t.originalCurrency && t.originalCurrency !== globalCurrency) {
            amount = t.originalAmount * (exchangeRates[t.originalCurrency] || 1);
          }
          return sum + amount;
        }, 0);

      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => {
          let amount = Math.abs(t.amount);
          // Convert amount if it's in a different currency
          if (t.originalAmount && t.originalCurrency && t.originalCurrency !== globalCurrency) {
            amount = Math.abs(t.originalAmount * (exchangeRates[t.originalCurrency] || 1));
          }
          return sum + amount;
        }, 0);

      months.push({
        month: format(monthStart, 'MMM yyyy', { locale: enUS }),
        income,
        expenses,
        date: monthStart, // Added for sorting
      });
    }

    return months;
  };

  const monthlyData = getMonthlyData();
  const maxAmount = Math.max(
    ...monthlyData.map(m => Math.max(m.income, m.expenses))
  );

  return (
    <div className="space-y-8">
      {/* Financial Report Section */}
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
                        +{currencySymbol}{formatCurrency(data.income, currencyFormat)}
                      </span>
                      <span className="text-sm text-red-600">
                        -{currencySymbol}{formatCurrency(data.expenses, currencyFormat)}
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

      {/* Expenses Trend Chart */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Expenses Trend</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#6B7280' }}
                />
                <YAxis 
                  tick={{ fill: '#6B7280' }}
                  tickFormatter={(value) => formatCurrency(value, currencyFormat)}
                />
                <Tooltip 
                  formatter={(value: string | number | Array<string | number>) => {
                    if (typeof value === 'number') {
                      return [formatCurrency(value, currencyFormat), 'Expenses'];
                    }
                    return [value, 'Expenses'];
                  }}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                  }}
                />
                <defs>
                  <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333EA" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#9333EA" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#9333EA"
                  fill="url(#expensesGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report; 