import { currencies } from './currencies';

interface CurrencyFormat {
  currency: string;
  placement: 'before' | 'after';
  numberFormat: string;
}

export const formatCurrency = (amount: number, format: CurrencyFormat): string => {
  const currencySymbol = currencies.find(c => c.code === format.currency)?.symbol || '$';
  
  // Format the number according to the selected format
  let formattedNumber = '';
  switch (format.numberFormat) {
    case '123.456,78':
      formattedNumber = amount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      break;
    case '123 456.78':
      formattedNumber = amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ');
      break;
    default: // '123,456.78'
      formattedNumber = amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // Apply currency placement
  return format.placement === 'before' 
    ? `${currencySymbol}${formattedNumber}`
    : `${formattedNumber}${currencySymbol}`;
}; 