import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useCurrency } from '@/hooks/useCurrency';
import { formatCurrency } from '@/utils/formatters';
import { CurrencyFormat } from '@/types';

const CurrencySettings = () => {
  const dispatch = useDispatch();
  const { globalCurrency, currencyFormat } = useSelector((state: RootState) => state.budget);
  const { currencySymbol } = useCurrency();

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: 'budget/setGlobalCurrency', payload: e.target.value });
  };

  const handlePlacementChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFormat: CurrencyFormat = {
      ...currencyFormat,
      placement: e.target.value as 'before' | 'after'
    };
    dispatch({ type: 'budget/setCurrencyFormat', payload: newFormat });
  };

  const handleDecimalPlacesChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'min' | 'max'
  ) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 0 || value > 4) {
      return;
    }

    const currentMin = type === 'min' ? value : currencyFormat.numberFormat.minimumFractionDigits;
    const currentMax = type === 'max' ? value : currencyFormat.numberFormat.maximumFractionDigits;

    if (currentMin > currentMax) {
      return;
    }

    const newFormat: CurrencyFormat = {
      ...currencyFormat,
      numberFormat: {
        minimumFractionDigits: currentMin,
        maximumFractionDigits: currentMax
      }
    };
    dispatch({ type: 'budget/setCurrencyFormat', payload: newFormat });
  };

  const previewAmount = 1234.56;
  const formattedPreview = formatCurrency(previewAmount, currencyFormat);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Currency Settings</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
            Currency
          </label>
          <select
            id="currency"
            value={globalCurrency}
            onChange={handleCurrencyChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="USD">US Dollar ($)</option>
            <option value="EUR">Euro (€)</option>
            <option value="GBP">British Pound (£)</option>
            <option value="JPY">Japanese Yen (¥)</option>
          </select>
        </div>

        <div>
          <label htmlFor="placement" className="block text-sm font-medium text-gray-700">
            Symbol Placement
          </label>
          <select
            id="placement"
            value={currencyFormat.placement}
            onChange={handlePlacementChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="before">Before amount</option>
            <option value="after">After amount</option>
          </select>
        </div>

        <div>
          <label htmlFor="minDecimals" className="block text-sm font-medium text-gray-700">
            Minimum Decimal Places
          </label>
          <input
            type="number"
            id="minDecimals"
            min={0}
            max={4}
            value={currencyFormat.numberFormat.minimumFractionDigits}
            onChange={(e) => handleDecimalPlacesChange(e, 'min')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {currencyFormat.numberFormat.minimumFractionDigits < 0 && (
            <p className="text-red-500 text-sm mt-1">
              Minimum decimal places must be between 0 and 4
            </p>
          )}
          {currencyFormat.numberFormat.minimumFractionDigits > currencyFormat.numberFormat.maximumFractionDigits && (
            <p className="text-red-500 text-sm mt-1">
              Minimum decimal places cannot be greater than maximum
            </p>
          )}
        </div>

        <div>
          <label htmlFor="maxDecimals" className="block text-sm font-medium text-gray-700">
            Maximum Decimal Places
          </label>
          <input
            type="number"
            id="maxDecimals"
            min={0}
            max={4}
            value={currencyFormat.numberFormat.maximumFractionDigits}
            onChange={(e) => handleDecimalPlacesChange(e, 'max')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {currencyFormat.numberFormat.maximumFractionDigits > 4 && (
            <p className="text-red-500 text-sm mt-1">
              Maximum decimal places must be between 0 and 4
            </p>
          )}
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700">Preview</h3>
          <p className="text-lg mt-1">{`Preview: ${formattedPreview}`}</p>
        </div>
      </div>
    </div>
  );
};

export default CurrencySettings; 