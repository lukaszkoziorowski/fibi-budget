import { useState, useEffect } from 'react';
import { getExchangeRate } from '@/utils/currencies';
import { Transaction } from '@/store/budgetSlice';

export const useExchangeRates = (transactions: Transaction[], globalCurrency: string) => {
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchRates = async () => {
      const uniqueCurrencies = new Set(transactions.map(t => t.originalCurrency || t.currency));
      const rates: Record<string, number> = {};
      
      for (const currency of uniqueCurrencies) {
        if (currency !== globalCurrency) {
          rates[currency] = await getExchangeRate(currency, globalCurrency);
        }
      }
      
      setExchangeRates(rates);
    };

    fetchRates();
  }, [transactions, globalCurrency]);

  const convertAmount = (amount: number, fromCurrency: string) => {
    if (fromCurrency === globalCurrency) return amount;
    return amount * (exchangeRates[fromCurrency] || 1);
  };

  return {
    exchangeRates,
    convertAmount,
  };
}; 