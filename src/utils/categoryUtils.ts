import { Transaction } from '@/types';

export const calculateCategoryActivity = async (
  categoryId: string,
  transactions: Transaction[],
  currentMonth: string,
  convertAmount: (amount: number, fromCurrency?: string) => Promise<number>
): Promise<number> => {
  const startOfMonth = new Date(currentMonth);
  const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0);

  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return (
      transaction.categoryId === categoryId &&
      transactionDate >= startOfMonth &&
      transactionDate <= endOfMonth
    );
  });

  let total = 0;
  for (const transaction of filteredTransactions) {
    total += await convertAmount(transaction.amount, transaction.currency);
  }

  return total;
};

export const validateCategoryOperation = {
  canUpdate: (name: string, budget: string): boolean => {
    if (!name.trim()) return false;
    const budgetNum = Number(budget);
    return !isNaN(budgetNum) && budgetNum >= 0;
  },

  canDelete: (categoryId: string, transactions: Transaction[]): boolean => {
    return !transactions.some(transaction => transaction.categoryId === categoryId);
  }
}; 