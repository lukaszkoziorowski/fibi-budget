export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'cash';
  balance: number;
  currency: string;
  color: string;
  isHidden: boolean;
}

export interface AccountTransaction {
  id: string;
  accountId: string;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  date: string;
  categoryId: string;
}

export interface AccountBalance {
  accountId: string;
  balance: number;
  currency: string;
  lastUpdated: string;
} 