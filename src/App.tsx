import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import Transactions from '@/components/Transactions';
import Report from '@/components/Report';
import Login from './components/Login';
import SignUp from './components/SignUp';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';

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

function App() {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Auth pages - full screen */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <SignUp />
                </PublicRoute>
              }
            />
            
            {/* Main app layout */}
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <div className="min-h-screen bg-background">
                    <Navigation 
                      isCollapsed={isNavCollapsed} 
                      onCollapsedChange={setIsNavCollapsed} 
                    />
                    <main className={`min-h-screen ${isMobile ? 'pb-20' : ''}`}>
                      <div className={`mx-auto transition-all duration-300 ${
                        !isMobile ? (isNavCollapsed ? 'pl-16' : 'pl-64') : ''
                      }`}>
                        <div className="max-w-[1000px] mx-auto px-4 py-6 md:py-8">
                          <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/transactions" element={<Transactions />} />
                            <Route path="/report" element={<Report />} />
                          </Routes>
                        </div>
                      </div>
                    </main>
                  </div>
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;
