export interface CurrencyFormat {
  currency: string;
  locale: string;
  placement: 'before' | 'after';
  numberFormat: {
    minimumFractionDigits: number;
    maximumFractionDigits: number;
  };
  dateFormat: string;
}

export interface CategoryGroup {
  id: string;
  name: string;
  isCollapsed?: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  budget: number;
  groupId: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  target?: number;
  upcomingTransaction?: number;
  creditSpending?: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId: string | null;
  currency: string;
  accountId: string;
}

export interface BudgetState {
  categories: Category[];
  categoryGroups: CategoryGroup[];
  transactions: Transaction[];
  currentMonth: string;
  globalCurrency: string;
  currencyFormat: CurrencyFormat;
  balance: number;
  budgetName: string;
}

export interface RootState {
  budget: BudgetState;
} 