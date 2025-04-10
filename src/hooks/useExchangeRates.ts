import { useMemo } from 'react';
import { getExchangeRate } from '@/utils/currencies';

export const useExchangeRates = (targetCurrency: string) => {
  const convertAmount = useMemo(() => {
    return async (amount: number, fromCurrency: string = targetCurrency): Promise<number> => {
      if (fromCurrency === targetCurrency) {
        return amount;
      }

      try {
        const rate = await getExchangeRate(fromCurrency, targetCurrency);
        return amount * rate;
      } catch (error) {
        console.error('Error converting currency:', error);
        return amount; // Fallback to original amount if conversion fails
      }
    };
  }, [targetCurrency]);

  return {
    convertAmount
  };
}; 