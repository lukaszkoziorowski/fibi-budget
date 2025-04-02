import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setBudgetName, setCurrencyFormat, setGlobalCurrency } from '@/store/budgetSlice';

interface BudgetSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BudgetSettingsModal: React.FC<BudgetSettingsModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { budgetName, currencyFormat, globalCurrency } = useSelector((state: RootState) => state.budget);
  
  const [localBudgetName, setLocalBudgetName] = useState(budgetName);
  const [localCurrency, setLocalCurrency] = useState(currencyFormat.currency);
  const [localCurrencyPlacement, setLocalCurrencyPlacement] = useState(currencyFormat.placement);
  const [localNumberFormat, setLocalNumberFormat] = useState(currencyFormat.numberFormat);
  const [localDateFormat, setLocalDateFormat] = useState(currencyFormat.dateFormat);

  useEffect(() => {
    if (isOpen) {
      setLocalBudgetName(budgetName);
      setLocalCurrency(globalCurrency);
      setLocalCurrencyPlacement(currencyFormat.placement);
      setLocalNumberFormat(currencyFormat.numberFormat);
      setLocalDateFormat(currencyFormat.dateFormat);
    }
  }, [isOpen, budgetName, globalCurrency, currencyFormat]);

  const handleApplySettings = () => {
    dispatch(setBudgetName(localBudgetName));
    dispatch(setGlobalCurrency(localCurrency));
    dispatch(setCurrencyFormat({
      currency: localCurrency,
      placement: localCurrencyPlacement,
      numberFormat: localNumberFormat,
      dateFormat: localDateFormat,
    }));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-secondary">
          <h2 className="text-xl font-semibold text-content-primary">Budget Settings</h2>
          <button
            onClick={onClose}
            className="text-content-secondary hover:text-content-primary transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Budget Name */}
          <div className="space-y-2">
            <label htmlFor="budgetName" className="block text-sm font-medium text-content-primary">
              Budget Name
            </label>
            <input
              type="text"
              id="budgetName"
              value={localBudgetName}
              onChange={(e) => setLocalBudgetName(e.target.value)}
              className="w-full px-3 py-2 border border-secondary rounded-md bg-background text-content-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="currency" className="block text-sm font-medium text-content-primary">
                Currency
              </label>
              <select
                id="currency"
                value={localCurrency}
                onChange={(e) => setLocalCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-secondary rounded-md bg-background text-content-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="USD">US Dollar—USD</option>
                <option value="EUR">Euro—EUR</option>
                <option value="GBP">British Pound—GBP</option>
                <option value="PLN">Polish Złoty—PLN</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="currencyPlacement" className="block text-sm font-medium text-content-primary">
                Currency Placement
              </label>
              <select
                id="currencyPlacement"
                value={localCurrencyPlacement}
                onChange={(e) => setLocalCurrencyPlacement(e.target.value as 'before' | 'after')}
                className="w-full px-3 py-2 border border-secondary rounded-md bg-background text-content-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="before">Before amount ($123,456.78)</option>
                <option value="after">After amount (123,456.78$)</option>
              </select>
            </div>
          </div>

          {/* Number Format */}
          <div className="space-y-2">
            <label htmlFor="numberFormat" className="block text-sm font-medium text-content-primary">
              Number Format
            </label>
            <select
              id="numberFormat"
              value={localNumberFormat}
              onChange={(e) => setLocalNumberFormat(e.target.value)}
              className="w-full px-3 py-2 border border-secondary rounded-md bg-background text-content-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="123,456.78">123,456.78</option>
              <option value="123.456,78">123.456,78</option>
              <option value="123 456.78">123 456.78</option>
            </select>
          </div>

          {/* Date Format */}
          <div className="space-y-2">
            <label htmlFor="dateFormat" className="block text-sm font-medium text-content-primary">
              Date Format
            </label>
            <select
              id="dateFormat"
              value={localDateFormat}
              onChange={(e) => setLocalDateFormat(e.target.value)}
              className="w-full px-3 py-2 border border-secondary rounded-md bg-background text-content-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="MM/DD/YYYY">12/30/2025</option>
              <option value="DD/MM/YYYY">30/12/2025</option>
              <option value="YYYY-MM-DD">2025-12-30</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-secondary">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-content-secondary hover:text-content-primary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApplySettings}
            className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetSettingsModal; 