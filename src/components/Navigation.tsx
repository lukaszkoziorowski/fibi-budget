import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useSelector, useDispatch } from 'react-redux';
import { setGlobalCurrency } from '@/store/budgetSlice';
import { RootState } from '@/store';
import { currencies } from '@/utils/currencies';
import {
  HomeIcon,
  ArrowsRightLeftIcon,
  ChartBarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  Cog6ToothIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import AccountsDropdown from './AccountsDropdown';

interface NavigationProps {
  isCollapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

const Navigation = ({ isCollapsed, onCollapsedChange }: NavigationProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const { budgetName } = useSelector((state: RootState) => state.budget);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigationItems = [
    { path: '/', name: 'Home', icon: HomeIcon },
    { path: '/transactions', name: 'Transactions', icon: ArrowsRightLeftIcon },
    { path: '/report', name: 'Report', icon: ChartBarIcon },
  ];

  const getUserDisplayName = () => {
    if (budgetName && budgetName !== 'My Budget') {
      return `${budgetName}'s Budget`;
    }
    if (currentUser?.displayName) {
      return `${currentUser.displayName}'s Budget`;
    }
    return "My Budget";
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const renderMobileNavigation = () => (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
        <div className="flex justify-around items-center h-16">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center w-full h-full ${
                  isActive(item.path)
                    ? 'text-primary'
                    : 'text-gray-500 hover:text-gray-500'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 right-4 z-50 p-2 rounded-md text-gray-500 hover:text-gray-700 md:hidden"
      >
        {isMobileMenuOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile Menu Content */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{getUserDisplayName()}</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Accounts Dropdown for Mobile */}
            <div className="pt-2 pb-1 border-t border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-2 px-3">Accounts</h3>
              <AccountsDropdown isCollapsed={false} />
            </div>

            <button
              onClick={() => navigate('/settings')}
              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <Cog6ToothIcon className="w-5 h-5 mr-3" />
              Settings
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md mt-2"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );

  const renderDesktopNavigation = () => (
    <nav
      className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 overflow-y-auto ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold truncate">{getUserDisplayName()}</h2>
          )}
          <button
            onClick={() => onCollapsedChange(!isCollapsed)}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700"
          >
            {isCollapsed ? (
              <ChevronRightIcon className="w-8 h-8" />
            ) : (
              <ChevronLeftIcon className="w-8 h-8" />
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <div className="space-y-1">
              <div>
                <div className="space-y-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center justify-center md:justify-start h-10 px-2 text-sm rounded-md ${
                          isActive(item.path)
                            ? 'bg-primary text-white hover:text-white'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-700'
                        }`}
                      >
                        <div className="w-10 h-10 flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>
                        {!isCollapsed && <span className="ml-2">{item.name}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Accounts Dropdown for Desktop */}
              <div className="mt-4 mb-2">
                <AccountsDropdown isCollapsed={isCollapsed} />
              </div>
            </div>
          </div>
        </div>

        <div className="p-2 border-t border-gray-200">
          <button
            onClick={() => navigate('/settings')}
            className="flex items-center justify-center md:justify-start w-full h-10 px-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md mb-2"
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <Cog6ToothIcon className="w-5 h-5" />
            </div>
            {!isCollapsed && <span className="ml-2">Settings</span>}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center md:justify-start w-full h-10 px-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
            </div>
            {!isCollapsed && <span className="ml-2">Logout</span>}
          </button>
        </div>
      </div>
    </nav>
  );

  return (
    <>
      {isMobile ? renderMobileNavigation() : renderDesktopNavigation()}
    </>
  );
};

export default Navigation; 