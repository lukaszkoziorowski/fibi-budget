export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  categoryId: string;
  type: 'income' | 'expense';
}

export interface Category {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  available: number;
  color: string;
}

export interface BudgetState {
  available: number;
  categories: Category[];
  transactions: Transaction[];
}

export interface RootState {
  budget: BudgetState;
} 