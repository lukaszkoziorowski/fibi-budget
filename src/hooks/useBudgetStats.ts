import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { calculateCategoryActivity } from '@/utils/categoryUtils';
import { useExchangeRates } from './useExchangeRates';

export const useBudgetStats = () => {
  const { categories, transactions: budgetTransactions, currentMonth } = useSelector((state: RootState) => state.budget);
  const { transactions: accountTransactions } = useSelector((state: RootState) => state.accounts);
  const { currencyFormat } = useSelector((state: RootState) => state.budget);
  const { convertAmount } = useExchangeRates(currencyFormat.currency);
  const [stats, setStats] = useState({
    totalBudget: 0,
    totalActivity: 0,
    remainingBudget: 0,
    percentUsed: 0,
    assignedTotal: 0,
    availableToAssign: 0,
    totalTransactions: 0,
    totalExpenses: 0,
    categoryGroups: {} as Record<string, {
      budget: number;
      activity: number;
      remaining: number;
      percentUsed: number;
    }>
  });

  useEffect(() => {
    let isMounted = true;

    const calculateStats = async () => {
      try {
        const totalBudget = categories.reduce((sum, category) => sum + (category.budget || 0), 0);
        const totalTransactions = budgetTransactions.length + accountTransactions.length;
        
        let totalActivity = 0;
        
        // Calculate total expenses by summing up all category activities
        for (const category of categories) {
          const activity = await calculateCategoryActivity(
            category.id,
            budgetTransactions,
            currentMonth,
            convertAmount
          );
          totalActivity += activity || 0;
        }
        
        // Calculate total expenses from all transactions (both budget and account)
        let totalExpenses = 0;
        const startOfMonth = new Date(currentMonth);
        const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0);
        
        // Process budget transactions
        for (const transaction of budgetTransactions) {
          const transactionDate = new Date(transaction.date);
          if (transactionDate >= startOfMonth && transactionDate <= endOfMonth) {
            const amount = Math.abs(transaction.amount);
            const convertedAmount = await convertAmount(amount, transaction.currency);
            totalExpenses += convertedAmount;
          }
        }
        
        // Process account transactions
        for (const transaction of accountTransactions) {
          const transactionDate = new Date(transaction.date);
          if (transactionDate >= startOfMonth && transactionDate <= endOfMonth) {
            const amount = Math.abs(transaction.amount);
            const convertedAmount = await convertAmount(amount, transaction.currency);
            totalExpenses += convertedAmount;
          }
        }

        const remainingBudget = totalBudget - totalActivity;
        const percentUsed = totalBudget > 0 ? (totalActivity / totalBudget) * 100 : 0;
        const assignedTotal = totalBudget;
        const availableToAssign = remainingBudget;

        // Calculate category group statistics
        const categoryGroups = categories.reduce((groups, category) => {
          const groupId = category.groupId || 'uncategorized';
          if (!groups[groupId]) {
            groups[groupId] = {
              budget: 0,
              activity: 0,
              remaining: 0,
              percentUsed: 0
            };
          }

          groups[groupId].budget += category.budget || 0;
          return groups;
        }, {} as Record<string, {
          budget: number;
          activity: number;
          remaining: number;
          percentUsed: number;
        }>);

        // Calculate activities for each group
        for (const [groupId, group] of Object.entries(categoryGroups)) {
          let groupActivity = 0;
          const groupCategories = categories.filter(cat => (cat.groupId || 'uncategorized') === groupId);
          
          for (const category of groupCategories) {
            const activity = await calculateCategoryActivity(
              category.id,
              budgetTransactions,
              currentMonth,
              convertAmount
            );
            groupActivity += activity || 0;
          }

          group.activity = groupActivity;
          group.remaining = group.budget - groupActivity;
          group.percentUsed = group.budget > 0 ? (groupActivity / group.budget) * 100 : 0;
        }

        if (isMounted) {
          setStats({
            totalBudget,
            totalActivity,
            remainingBudget,
            percentUsed,
            assignedTotal,
            availableToAssign,
            totalTransactions,
            totalExpenses,
            categoryGroups
          });
        }
      } catch (error) {
        console.error('Error calculating budget stats:', error);
        if (isMounted) {
          setStats(prevStats => ({
            ...prevStats,
            totalActivity: 0,
            remainingBudget: prevStats.totalBudget,
            percentUsed: 0,
            availableToAssign: prevStats.totalBudget
          }));
        }
      }
    };

    calculateStats();

    return () => {
      isMounted = false;
    };
  }, [categories, budgetTransactions, accountTransactions, currentMonth, convertAmount]);

  return stats;
}; 