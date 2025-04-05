import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import Transactions from '@/components/Transactions';
import Report from '@/components/Report';
import Login from './components/Login';
import SignUp from './components/SignUp';
import AccountSettings from './components/AccountSettings';
import AccountConnections from './components/AccountConnections';
import Settings from './components/Settings';
import LandingPage from './components/LandingPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { setGlobalCurrency, resetState, loadUserData } from './store/budgetSlice';
import { currencies } from './utils/currencies';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// PrivateRoute component
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

// PublicRoute component - redirects to dashboard if user is logged in
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return !currentUser ? <>{children}</> : <Navigate to="/" />;
};

// MainAppLayout component to handle navigation visibility
const MainAppLayout = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  
  useEffect(() => {
    // Load user's data when component mounts
    if (currentUser) {
      dispatch(loadUserData());
    }
  }, [dispatch, currentUser]);
  
  // Check if the current path is an account or settings page
  const isAccountPage = location.pathname.startsWith('/account/');
  const isSettingsPage = location.pathname === '/settings';
  const hideNavigation = isAccountPage || isSettingsPage;
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Only show navigation when not on account or settings pages */}
      {!hideNavigation && (
        <Navigation 
          isCollapsed={isNavCollapsed} 
          onCollapsedChange={setIsNavCollapsed} 
        />
      )}
      <main className={`min-h-screen ${isMobile ? 'pb-20' : ''}`}>
        <div className={`mx-auto transition-all duration-300 ${
          !hideNavigation && !isMobile ? (isNavCollapsed ? 'pl-16' : 'pl-64') : ''
        }`}>
          <div className="max-w-[1000px] mx-auto px-4 py-6 md:py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/report" element={<Report />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/account/settings" element={<AccountSettings />} />
              <Route path="/account/connections" element={<AccountConnections />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
};

// Main App component
const App = () => {
  return (
    <AuthProvider>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
            <Route path="/*" element={<PrivateRoute><MainAppLayout /></PrivateRoute>} />
          </Routes>
        </Router>
      </Provider>
    </AuthProvider>
  );
};

export default App;
