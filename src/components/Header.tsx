import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { RootState } from '@/store';
import { setGlobalCurrency } from '@/store/budgetSlice';
import { currencies } from '@/utils/currencies';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const globalCurrency = useSelector((state: RootState) => state.budget.globalCurrency);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setGlobalCurrency(event.target.value));
  };

  return (
    <header className="bg-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-bold">Fibi Budget</span>
          </div>

          {/* Currency and User section */}
          <div className="flex items-center gap-4">
            {/* Currency Selector */}
            <select
              value={globalCurrency}
              onChange={handleCurrencyChange}
              className="bg-purple-700 text-white border border-purple-500 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} ({currency.symbol})
                </option>
              ))}
            </select>

            {/* User section */}
            {currentUser ? (
              <>
                <div className="flex items-center gap-2">
                  {currentUser.photoURL && (
                    <img
                      src={currentUser.photoURL}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div className="text-sm">
                    <div className="font-medium">
                      {currentUser.displayName || currentUser.email}
                    </div>
                    {currentUser.displayName && (
                      <div className="text-purple-200 text-xs">
                        {currentUser.email}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors"
                >
                  Log Out
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors"
              >
                Log In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 