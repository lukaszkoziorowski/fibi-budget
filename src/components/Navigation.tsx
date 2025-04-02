import { useState } from 'react';
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
  WrenchIcon,
  UserGroupIcon,
  FlagIcon,
  UserIcon,
  UsersIcon,
  ArrowsRightLeftIcon as ConnectionsIcon,
  AcademicCapIcon,
  CommandLineIcon,
  ArrowDownTrayIcon,
  ArrowRightOnRectangleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import BudgetSettingsModal from './BudgetSettingsModal';

interface NavigationProps {
  isCollapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

const Navigation = ({ isCollapsed, onCollapsedChange }: NavigationProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const globalCurrency = useSelector((state: RootState) => state.budget.globalCurrency);
  const [isUserMenuExpanded, setIsUserMenuExpanded] = useState(false);
  const [isBudgetSettingsOpen, setIsBudgetSettingsOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigationItems = [
    { path: '/', name: 'Home', icon: HomeIcon },
    { path: '/transactions', name: 'Transactions', icon: ArrowsRightLeftIcon },
    { path: '/report', name: 'Report', icon: ChartBarIcon },
  ];

  const getUserDisplayName = () => {
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

  const settingsItems = [
    { name: 'Budget Settings', icon: WrenchIcon, path: '/settings/budget' },
    { name: 'Manage Payees', icon: UserGroupIcon, path: '/settings/payees' },
    { name: 'Edit Flags', icon: FlagIcon, path: '/settings/flags' },
  ];

  const accountItems = [
    { name: 'Account Settings', icon: UserIcon, path: '/account/settings' },
    { name: 'YNAB Together', icon: UsersIcon, path: '/account/ynab-together' },
    { name: 'Manage Connections', icon: ConnectionsIcon, path: '/account/connections' },
    { name: 'Join a Workshop', icon: AcademicCapIcon, path: '/account/workshop' },
    { name: 'Keyboard Shortcuts', icon: CommandLineIcon, path: '/account/shortcuts' },
    { name: 'Migrate From', icon: ArrowDownTrayIcon, path: '/account/migrate' },
  ];

  const legalItems = [
    { name: 'Privacy Policy', icon: DocumentTextIcon, path: '/legal/privacy' },
  ];

  const handleSettingsClick = (path: string) => {
    if (path === '/settings/budget') {
      setIsBudgetSettingsOpen(true);
      setIsUserMenuExpanded(false);
    } else {
      navigate(path);
    }
  };

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setGlobalCurrency(event.target.value));
  };

  return (
    <>
      <nav className={`fixed left-0 top-0 h-screen bg-surface shadow-lg transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo and User Info */}
          <div className="px-4 py-4 border-b border-secondary">
            <div className={`flex flex-col ${isCollapsed ? 'items-center' : 'items-start'}`}>
              {/* Logo */}
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} mb-4`}>
                {isCollapsed ? (
                  <span className="text-2xl font-bold text-primary">F</span>
                ) : (
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-primary">FiBi</span>
                  </div>
                )}
              </div>

              {/* User Info */}
              {!isCollapsed && (
                <div className="w-full">
                  <button
                    onClick={() => setIsUserMenuExpanded(!isUserMenuExpanded)}
                    className="flex items-center gap-3 w-full hover:bg-background rounded-md p-2 transition-colors"
                  >
                    {currentUser?.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt="Profile"
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-lg font-semibold">
                        {currentUser?.email?.[0].toUpperCase() || 'U'}
                      </div>
                    )}
                    <div className="flex flex-1 items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-content-primary text-left">{getUserDisplayName()}</span>
                        {currentUser?.email && (
                          <span className="text-xs text-content-secondary">{currentUser.email}</span>
                        )}
                      </div>
                      <ChevronDownIcon className={`w-5 h-5 transition-transform ${isUserMenuExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {/* Expandable Menu */}
                  {isUserMenuExpanded && (
                    <div className="mt-2 space-y-4">
                      {/* Settings Section */}
                      <div>
                        {settingsItems.map((item) => (
                          <button
                            key={item.path}
                            onClick={() => handleSettingsClick(item.path)}
                            className="flex items-center px-2 py-2 text-sm text-content-secondary hover:bg-background rounded-md w-full"
                          >
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.name}
                          </button>
                        ))}
                      </div>

                      {/* Account Section */}
                      <div className="border-t border-secondary pt-4">
                        <div className="px-2 mb-2 text-xs font-semibold text-content-secondary uppercase">Account</div>
                        {accountItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className="flex items-center px-2 py-2 text-sm text-content-secondary hover:bg-background rounded-md"
                          >
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.name}
                          </Link>
                        ))}
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-2 py-2 text-sm text-content-secondary hover:bg-background rounded-md"
                        >
                          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                          Log Out
                        </button>
                      </div>

                      {/* Legal Section */}
                      <div className="border-t border-secondary pt-4">
                        <div className="px-2 mb-2 text-xs font-semibold text-content-secondary uppercase">Legal</div>
                        {legalItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className="flex items-center px-2 py-2 text-sm text-content-secondary hover:bg-background rounded-md"
                          >
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 py-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 mb-1 transition-colors ${
                    isActive(item.path)
                      ? 'bg-secondary text-primary border-r-4 border-primary'
                      : 'text-content-secondary hover:bg-background'
                  }`}
                >
                  <Icon className="w-6 h-6 shrink-0" />
                  {!isCollapsed && (
                    <span className="ml-3 text-sm font-medium">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Collapse Button */}
          <div className="px-4 py-4 border-t border-secondary">
            <button
              onClick={() => onCollapsedChange(!isCollapsed)}
              className="flex items-center justify-center w-full p-2 text-content-secondary bg-background hover:bg-secondary rounded-md transition-colors"
            >
              {isCollapsed ? (
                <ChevronRightIcon className="w-6 h-6" />
              ) : (
                <>
                  <ChevronLeftIcon className="w-6 h-6" />
                  <span className="ml-2 text-sm font-medium">Collapse menu</span>
                </>
              )}
            </button>
          </div>
        </div>
      </nav>

      <BudgetSettingsModal
        isOpen={isBudgetSettingsOpen}
        onClose={() => setIsBudgetSettingsOpen(false)}
      />
    </>
  );
};

export default Navigation; 