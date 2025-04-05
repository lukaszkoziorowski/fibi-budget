import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { currencies } from '@/utils/currencies';

export const DEFAULT_CURRENCY_FORMAT = {
  currency: 'USD',
  placement: 'before' as const,
  numberFormat: '123,456.78',
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