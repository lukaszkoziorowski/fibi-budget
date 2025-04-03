import React, { useState } from 'react';
import { UserIcon, WrenchIcon, ArrowLeftIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import BudgetSettings from './BudgetSettings';

const Settings = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'budget' | 'account' | null>(null);

  const renderContent = () => {
    if (activeSection === 'budget') {
      return <BudgetSettings onBack={() => setActiveSection(null)} />;
    }
    
    return (
      <>
        {/* Settings Tiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Budget Settings Tile */}
          <div 
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 cursor-pointer hover:shadow-md transition-all"
            onClick={() => setActiveSection('budget')}
          >
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                <BanknotesIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Budget</h2>
              <p className="text-gray-600 mt-2">
                Update your budget settings and preferences
              </p>
            </div>
          </div>

          {/* Account Settings Tile */}
          <div 
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 cursor-pointer hover:shadow-md transition-all"
            onClick={() => navigate('/account/settings')}
          >
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <UserIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Account</h2>
              <p className="text-gray-600 mt-2">
                Manage your personal and contact details
              </p>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-4">
        {/* Breadcrumb navigation */}
        <div className="mb-4">
          {activeSection === 'budget' ? (
            <div className="flex items-center text-gray-600 text-sm py-4">
              <span className="cursor-pointer hover:text-gray-800" onClick={() => setActiveSection(null)}>Settings</span>
              <span className="mx-2">›</span>
              <span className="font-medium text-gray-800">Budget Settings</span>
            </div>
          ) : (
            <Link to="/" className="flex items-center text-purple-600 hover:text-purple-700 py-4">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              <span>Back to Budget</span>
            </Link>
          )}
        </div>

        {/* Main heading */}
        {activeSection === 'budget' ? (
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Budget Settings</h1>
        ) : (
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>
        )}
        
        {renderContent()}
      </div>
    </div>
  );
};

export default Settings; 