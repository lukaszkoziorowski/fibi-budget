import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useCurrency } from './useCurrency';
import { useExchangeRates } from './useExchangeRates';
import { calculateAssignedTotal, calculateTotalExpenses } from '@/utils/categoryUtils';
import { Transaction, Category } from '@/types';

export const useBudgetStats = () => {
  const { balance, categories, transactions } = useSelector((state: RootState) => state.budget);
  const { currencyFormat } = useCurrency();
  const { convertAmount } = useExchangeRates(transactions, currencyFormat.currency);

  const assignedTotal = calculateAssignedTotal(categories);
  const availableToAssign = balance - assignedTotal;
  const totalTransactions = transactions.length;
  const totalExpenses = calculateTotalExpenses(transactions, convertAmount);

  const getCategoryStats = (categoryId: string) => {
    const categoryTransactions = transactions.filter(t => t.categoryId === categoryId);
    const spent = calculateTotalExpenses(categoryTransactions, convertAmount);
    const category = categories.find(c => c.id === categoryId);
    const remaining = category ? category.budget - spent : 0;
    const progress = category && category.budget > 0 ? (spent / category.budget) * 100 : 0;

    return {
      spent,
      remaining,
      progress: Math.min(progress, 100)
    };
  };

  return {
    balance,
    assignedTotal,
    availableToAssign,
    totalTransactions,
    totalExpenses,
    getCategoryStats
  };
}; 