import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setBudgetName, setCurrencyFormat, setGlobalCurrency, clearAllData } from '@/store/budgetSlice';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface BudgetSettingsProps {
  onBack: () => void;
}

const BudgetSettings: React.FC<BudgetSettingsProps> = ({ onBack }) => {
  const dispatch = useDispatch();
  const { budgetName, currencyFormat, globalCurrency } = useSelector((state: RootState) => state.budget);
  
  const [localBudgetName, setLocalBudgetName] = useState(budgetName);
  const [localCurrency, setLocalCurrency] = useState(globalCurrency);
  const [localCurrencyPlacement, setLocalCurrencyPlacement] = useState(currencyFormat.placement);
  const [localNumberFormat, setLocalNumberFormat] = useState(currencyFormat.numberFormat);
  const [localDateFormat, setLocalDateFormat] = useState(currencyFormat.dateFormat);
  
  const [editingField, setEditingField] = useState<string | null>(null);

  const saveField = (field: string) => {
    switch (field) {
      case 'budgetName':
        dispatch(setBudgetName(localBudgetName));
        break;
      case 'currency':
        dispatch(setGlobalCurrency(localCurrency));
        dispatch(setCurrencyFormat({
          ...currencyFormat,
          currency: localCurrency,
        }));
        break;
      case 'currencyPlacement':
        dispatch(setCurrencyFormat({
          ...currencyFormat,
          placement: localCurrencyPlacement,
        }));
        break;
      case 'numberFormat':
        dispatch(setCurrencyFormat({
          ...currencyFormat,
          numberFormat: localNumberFormat,
        }));
        break;
      case 'dateFormat':
        dispatch(setCurrencyFormat({
          ...currencyFormat,
          dateFormat: localDateFormat,
        }));
        break;
    }
    setEditingField(null);
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      dispatch(clearAllData());
      onBack();
    }
  };

  const getCurrencyLabel = (code: string) => {
    switch(code) {
      case 'USD': return 'US Dollar—USD';
      case 'EUR': return 'Euro—EUR';
      case 'GBP': return 'British Pound—GBP';
      case 'PLN': return 'Polish Złoty—PLN';
      default: return code;
    }
  };

  const getPlacementLabel = (placement: string) => {
    return placement === 'before' ? 'Before amount ($123,456.78)' : 'After amount (123,456.78$)';
  };

  const getDateFormatLabel = (format: string) => {
    switch(format) {
      case 'MM/DD/YYYY': return '12/30/2025';
      case 'DD/MM/YYYY': return '30/12/2025';
      case 'YYYY-MM-DD': return '2025-12-30';
      default: return format;
    }
  };

  const handleBack = () => {
    onBack();
  };

  return (
    <div className="max-w-3xl">
      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        {/* Budget Name */}
        <div className="border-b border-gray-200 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Budget Name</h3>
              {editingField === 'budgetName' ? (
                <div className="mt-1">
                  <input
                    type="text"
                    id="budgetName"
                    value={localBudgetName}
                    onChange={(e) => setLocalBudgetName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                    autoFocus
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => saveField('budgetName')}
                      className="px-3 py-1 text-xs text-white bg-purple-600 rounded-md hover:bg-purple-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm mt-1">{localBudgetName}</p>
              )}
            </div>
            {editingField !== 'budgetName' && (
              <button 
                onClick={() => setEditingField('budgetName')}
                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Currency */}
        <div className="border-b border-gray-200 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Currency</h3>
              {editingField === 'currency' ? (
                <div className="mt-1">
                  <select
                    id="currency"
                    value={localCurrency}
                    onChange={(e) => setLocalCurrency(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                    autoFocus
                  >
                    <option value="USD">US Dollar—USD</option>
                    <option value="EUR">Euro—EUR</option>
                    <option value="GBP">British Pound—GBP</option>
                    <option value="PLN">Polish Złoty—PLN</option>
                  </select>
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => saveField('currency')}
                      className="px-3 py-1 text-xs text-white bg-purple-600 rounded-md hover:bg-purple-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm mt-1">{getCurrencyLabel(localCurrency)}</p>
              )}
            </div>
            {editingField !== 'currency' && (
              <button 
                onClick={() => setEditingField('currency')}
                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Currency Placement */}
        <div className="border-b border-gray-200 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Currency Placement</h3>
              {editingField === 'currencyPlacement' ? (
                <div className="mt-1">
                  <select
                    id="currencyPlacement"
                    value={localCurrencyPlacement}
                    onChange={(e) => setLocalCurrencyPlacement(e.target.value as 'before' | 'after')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                    autoFocus
                  >
                    <option value="before">Before amount ($123,456.78)</option>
                    <option value="after">After amount (123,456.78$)</option>
                  </select>
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => saveField('currencyPlacement')}
                      className="px-3 py-1 text-xs text-white bg-purple-600 rounded-md hover:bg-purple-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm mt-1">{getPlacementLabel(localCurrencyPlacement)}</p>
              )}
            </div>
            {editingField !== 'currencyPlacement' && (
              <button 
                onClick={() => setEditingField('currencyPlacement')}
                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Number Format */}
        <div className="border-b border-gray-200 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Number Format</h3>
              {editingField === 'numberFormat' ? (
                <div className="mt-1">
                  <select
                    id="numberFormat"
                    value={localNumberFormat}
                    onChange={(e) => setLocalNumberFormat(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                    autoFocus
                  >
                    <option value="123,456.78">123,456.78</option>
                    <option value="123.456,78">123.456,78</option>
                    <option value="123 456.78">123 456.78</option>
                  </select>
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => saveField('numberFormat')}
                      className="px-3 py-1 text-xs text-white bg-purple-600 rounded-md hover:bg-purple-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm mt-1">{localNumberFormat}</p>
              )}
            </div>
            {editingField !== 'numberFormat' && (
              <button 
                onClick={() => setEditingField('numberFormat')}
                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Date Format */}
        <div className="border-b border-gray-200 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Date Format</h3>
              {editingField === 'dateFormat' ? (
                <div className="mt-1">
                  <select
                    id="dateFormat"
                    value={localDateFormat}
                    onChange={(e) => setLocalDateFormat(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                    autoFocus
                  >
                    <option value="MM/DD/YYYY">12/30/2025</option>
                    <option value="DD/MM/YYYY">30/12/2025</option>
                    <option value="YYYY-MM-DD">2025-12-30</option>
                  </select>
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => saveField('dateFormat')}
                      className="px-3 py-1 text-xs text-white bg-purple-600 rounded-md hover:bg-purple-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm mt-1">{getDateFormatLabel(localDateFormat)}</p>
              )}
            </div>
            {editingField !== 'dateFormat' && (
              <button 
                onClick={() => setEditingField('dateFormat')}
                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Reset Data */}
        <div className="pt-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">Reset All Data</h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  This will permanently delete all your categories, transactions, and budget settings. This action cannot be undone.
                </p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleResetData}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Reset All Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-6">
        <button
          onClick={handleBack}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Back to Settings
        </button>
      </div>
    </div>
  );
};

export default BudgetSettings; 