import { useState } from 'react';

interface ConnectedAccount {
  id: string;
  name: string;
  balance: number;
}

export const useConnectedAccounts = () => {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      // This would be replaced with actual bank connection logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAccounts([
        { id: '1', name: 'Checking Account', balance: 1000 },
        { id: '2', name: 'Savings Account', balance: 5000 }
      ]);
    } catch (err) {
      setError('Failed to connect to bank');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async (accountId: string) => {
    try {
      // This would be replaced with actual bank disconnection logic
      await new Promise(resolve => setTimeout(resolve, 500));
      setAccounts(accounts.filter(account => account.id !== accountId));
    } catch (err) {
      setError('Failed to disconnect account');
    }
  };

  return {
    accounts,
    isConnecting,
    error,
    connect,
    disconnect
  };
}; 