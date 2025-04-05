import { CurrencyFormat } from '@/types';

export const formatCurrency = (amount: number, format: CurrencyFormat): string => {
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
    ? `${format.currency} ${formattedNumber}`
    : `${formattedNumber} ${format.currency}`;
}; 