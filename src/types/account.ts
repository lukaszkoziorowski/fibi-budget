export type AccountType = 
  | 'checking'
  | 'savings'
  | 'creditCard'
  | 'cash'
  | 'lineOfCredit'
  | 'investment'
  | 'other';

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  date: string;
  description: string;
  categoryId?: string;
  userId: string;
  isReconciled: boolean;
  memo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  institutionName?: string;
  userId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AccountState {
  accounts: Account[];
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  activeAccountId: string | null;
} 