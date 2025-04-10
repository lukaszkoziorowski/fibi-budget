import { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Navigate, useLocation, useParams } from 'react-router-dom';
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
import { useDispatch } from 'react-redux';
import { loadUserData } from './store/budgetSlice';
import AccountTransactionPage from './components/Accounts/AccountTransactionPage';

interface RouteWrapperProps {
  children: React.ReactNode;
}

// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
  </div>
);

// PrivateRoute component
const PrivateRoute = ({ children }: RouteWrapperProps) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return currentUser ? <>{children}</> : <Navigate to="/login" replace />;
};

// PublicRoute component - redirects to dashboard if user is logged in
const PublicRoute = ({ children }: RouteWrapperProps) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return !currentUser ? <>{children}</> : <Navigate to="/" replace />;
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
    <div className="min-h-screen h-full bg-background">
      <div className="flex h-full">
        {/* Navigation */}
        {!hideNavigation && (
          <div 
            className={`
              ${isMobile ? 'fixed inset-y-0 left-0 z-30' : 'sticky top-0 h-screen'}
              transition-all duration-300 ease-in-out
              ${isNavCollapsed ? 'w-16' : 'w-64'}
            `}
          >
            <Navigation 
              isCollapsed={isNavCollapsed} 
              onCollapsedChange={setIsNavCollapsed} 
            />
          </div>
        )}

        {/* Main content area */}
        <main 
          className={`
            flex-1 h-full transition-all duration-300 ease-in-out
            ${!hideNavigation && !isMobile ? (isNavCollapsed ? 'pl-4' : 'pl-6') : 'px-4'}
            ${isMobile ? 'w-full' : ''}
            ${!hideNavigation && !isMobile ? (isNavCollapsed ? 'w-[calc(100%-4rem)]' : 'w-[calc(100%-16rem)]') : ''}
          `}
        >
          {/* Mobile overlay */}
          {isMobile && !isNavCollapsed && !hideNavigation && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-20"
              onClick={() => setIsNavCollapsed(true)}
            />
          )}

          {/* Content container */}
          <div className={`
            h-full
            max-w-[1400px] 
            py-6 md:py-8
            ${!hideNavigation && !isMobile ? 'pr-6' : 'px-4'}
          `}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

// AccountTransactionPageWrapper component
const AccountTransactionPageWrapper = () => {
  const { accountId } = useParams();
  return accountId ? <AccountTransactionPage accountId={accountId} /> : null;
};

// Create router
const router = createBrowserRouter([
  {
    path: "/landing",
    element: <LandingPage />,
    index: true
  },
  {
    path: "/login",
    element: <PublicRoute><Login /></PublicRoute>
  },
  {
    path: "/signup",
    element: <PublicRoute><SignUp /></PublicRoute>
  },
  {
    path: "/",
    element: <PrivateRoute><MainAppLayout /></PrivateRoute>,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: "transactions",
        element: <Transactions />
      },
      {
        path: "report",
        element: <Report />
      },
      {
        path: "settings",
        element: <Settings />
      },
      {
        path: "account/settings",
        element: <AccountSettings />
      },
      {
        path: "account/connections",
        element: <AccountConnections />
      },
      {
        path: "accounts/:accountId",
        element: <AccountTransactionPageWrapper />
      }
    ]
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
]);

// Main App component
const App = () => {
  return (
    <AuthProvider>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </AuthProvider>
  );
};

export default App;
