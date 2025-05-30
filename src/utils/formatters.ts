import { currencies } from './currencies';
import { CurrencyFormat } from '@/types';

const DEFAULT_CURRENCY_FORMAT: CurrencyFormat = {
  currency: 'USD',
  locale: 'en-US',
  placement: 'before',
  numberFormat: {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  },
  dateFormat: 'MM/DD/YYYY'
};

export const formatCurrency = (amount: number, format: CurrencyFormat = DEFAULT_CURRENCY_FORMAT): string => {
  const currencySymbol = currencies.find(c => c.code === format.currency)?.symbol || format.currency;
  
  // Handle negative numbers
  const isNegative = amount < 0;
  const absoluteNumber = Math.abs(amount).toLocaleString(format.locale, {
    minimumFractionDigits: format.numberFormat.minimumFractionDigits,
    maximumFractionDigits: format.numberFormat.maximumFractionDigits,
    useGrouping: true
  });

  // Apply currency placement and handle negative numbers
  let result = format.placement === 'before' 
    ? `${currencySymbol}${absoluteNumber}`
    : `${absoluteNumber}${currencySymbol}`;

  // Add negative sign in the correct position
  if (isNegative) {
    result = format.placement === 'before' ? `-${result}` : `-${result}`;
  }

  return result;
};

export const parseCurrency = (value: string, format: CurrencyFormat = DEFAULT_CURRENCY_FORMAT): number => {
  // Remove currency symbol and any other non-numeric characters except decimal point and minus sign
  const numericValue = value.replace(new RegExp(`[^0-9.${format.currency}-]+`, 'g'), '');
  return parseFloat(numericValue) || 0;
};

export const formatDate = (date: Date, format: string): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  switch (format) {
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    default:
      return date.toISOString().split('T')[0];
  }
}; 