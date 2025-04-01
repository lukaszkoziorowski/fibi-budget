import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import Transactions from '@/components/Transactions';
import Report from '@/components/Report';

function App() {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-background flex">
          <Navigation 
            isCollapsed={isNavCollapsed} 
            onCollapsedChange={setIsNavCollapsed} 
          />
          <main className={`flex-1 transition-all duration-300 ${
            isNavCollapsed ? 'ml-16' : 'ml-64'
          }`}>
            <div className="max-w-[1000px] mx-auto py-6 px-4">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/report" element={<Report />} />
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
