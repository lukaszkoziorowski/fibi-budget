import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { currencies } from '@/utils/currencies';
import { CurrencyFormat } from '@/types';

export const DEFAULT_CURRENCY_FORMAT: CurrencyFormat = {
  currency: 'USD',
  placement: 'before',
  numberFormat: {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  },
  dateFormat: 'MM/DD/YYYY'
};

export const useCurrency = () => {
  const { globalCurrency, currencyFormat = DEFAULT_CURRENCY_FORMAT } = useSelector(
    (state: RootState) => state.budget
  );

  const currencySymbol = currencies.find(c => c.code === globalCurrency)?.symbol || '$';

  return {
    globalCurrency,
    currencyFormat,
    currencySymbol,
  };
}; 