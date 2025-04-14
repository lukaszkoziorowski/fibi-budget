import { Transaction } from '@/types';

export const calculateCategoryActivity = async (
  categoryId: string,
  transactions: Transaction[],
  currentMonth: string,
  convertAmount: (amount: number, fromCurrency?: string) => Promise<number>
): Promise<number> => {
  try {
    console.log(`Calculating activity for category ${categoryId} with ${transactions.length} transactions`);
    
    const startOfMonth = new Date(currentMonth);
    const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0);
    
    console.log(`Date range: ${startOfMonth.toISOString()} to ${endOfMonth.toISOString()}`);

    const filteredTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const isInDateRange = transactionDate >= startOfMonth && transactionDate <= endOfMonth;
      const isMatchingCategory = transaction.categoryId === categoryId;
      
      console.log(`Transaction ${transaction.id}: date=${transaction.date}, category=${transaction.categoryId}, inRange=${isInDateRange}, matchingCategory=${isMatchingCategory}, type=${transaction.type}, amount=${transaction.amount}`);
      
      return isMatchingCategory && isInDateRange;
    });

    console.log(`Found ${filteredTransactions.length} matching transactions for category ${categoryId}`);

    let total = 0;
    for (const transaction of filteredTransactions) {
      // Always use absolute value for activity
      const amount = Math.abs(transaction.amount);
      
      const convertedAmount = await convertAmount(amount, transaction.currency);
      console.log(`Transaction ${transaction.id}: amount=${amount}, converted=${convertedAmount}`);
      total += convertedAmount;
    }

    console.log(`Total activity for category ${categoryId}: ${total}`);
    return total;
  } catch (error) {
    console.error('Error calculating category activity:', error);
    return 0;
  }
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