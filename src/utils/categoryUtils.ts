import { Transaction, Category } from '@/store/budgetSlice';

export const calculateCategoryActivity = (
  categoryId: string,
  transactions: Transaction[],
  currentMonth: string,
  convertAmount: (amount: number, currency: string) => number
) => {
  const currentMonthDate = new Date(currentMonth);
  return transactions
    .filter((t) => {
      const transactionDate = new Date(t.date);
      return t.categoryId === categoryId && 
             t.type === 'expense' &&
             transactionDate.getMonth() === currentMonthDate.getMonth() &&
             transactionDate.getFullYear() === currentMonthDate.getFullYear();
    })
    .reduce((sum, t) => {
      let amount = Math.abs(t.amount);
      
      // If the transaction has an original amount and currency
      if (t.originalAmount && t.originalCurrency) {
        amount = Math.abs(convertAmount(t.originalAmount, t.originalCurrency));
      }
      
      return sum + amount;
    }, 0);
};

export const calculateTotalExpenses = (
  transactions: Transaction[],
  convertAmount: (amount: number, currency: string) => number
) => {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => {
      let amount = Math.abs(t.amount);
      if (t.originalAmount && t.originalCurrency) {
        amount = Math.abs(convertAmount(t.originalAmount, t.originalCurrency));
      }
      return sum + amount;
    }, 0);
};

export const calculateAssignedTotal = (categories: Category[]) => {
  return categories.reduce((sum, category) => sum + category.budget, 0);
};

export const validateCategoryOperation = {
  canDelete: (categoryId: string, transactions: Transaction[]) => {
    return !transactions.some((t) => t.categoryId === categoryId);
  },
  
  canUpdate: (name: string, budget: string) => {
    const budgetNumber = Number(budget);
    return name.trim() !== '' && !isNaN(budgetNumber) && budgetNumber >= 0;
  },
}; 