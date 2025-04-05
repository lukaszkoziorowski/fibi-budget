export interface Transaction {
  id: string;
  amount: number;
  categoryId: string;
  date: string;
  description: string;
  type: 'income' | 'expense';
  currency: string;
}

export interface Category {
  id: string;
  name: string;
  budget: number;
  color?: string;
}

export interface CurrencyFormat {
  currency: string;
  placement: 'before' | 'after';
  numberFormat: string;
  dateFormat: string;
}

export interface BudgetState {
  balance: number;
  categories: Category[];
  transactions: Transaction[];
  currentMonth: string;
  globalCurrency: string;
  currencyFormat: CurrencyFormat;
}

export interface RootState {
  budget: BudgetState;
} 