export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface CurrencyFormat {
  placement: 'before' | 'after';
  symbol: string;
  decimalPlaces: number;
  thousandsSeparator: string;
  decimalSeparator: string;
}

export const currencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'PLN', name: 'Polish Złoty', symbol: 'zł' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
];

const EXCHANGE_RATE_API = 'https://api.exchangerate-api.com/v4/latest';

export const getExchangeRate = async (fromCurrency: string, toCurrency: string): Promise<number> => {
  try {
    const response = await fetch(`${EXCHANGE_RATE_API}/${fromCurrency}`);
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rate');
    }
    
    const data = await response.json();
    return data.rates[toCurrency];
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    throw error;
  }
};

// Re-export formatCurrency from formatters.ts
export { formatCurrency } from './formatters'; 