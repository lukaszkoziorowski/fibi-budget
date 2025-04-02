import React, { useState } from 'react';
import { XMarkIcon, UserIcon, WrenchIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import BudgetSettingsModal from './BudgetSettingsModal';

const Settings = () => {
  const navigate = useNavigate();
  const [isBudgetSettingsOpen, setIsBudgetSettingsOpen] = useState(false);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header with back button */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/" className="flex items-center text-primary hover:text-primary-dark">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span>Back to Budget</span>
        </Link>
        <button onClick={() => navigate('/')} className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100">
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      {/* Settings Tiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Budget Settings Tile */}
        <div 
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 cursor-pointer hover:shadow-md transition-all"
          onClick={() => setIsBudgetSettingsOpen(true)}
        >
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <WrenchIcon className="h-6 w-6 text-purple-600" />
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
            <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
            <p className="text-gray-600 mt-2">
              Manage your personal and contact details
            </p>
          </div>
        </div>
      </div>

      {/* Footer section with links */}
      <div className="py-4 border-t border-gray-200 mt-12">
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <a href="#" className="hover:text-gray-700">Terms of Service</a>
          <a href="#" className="hover:text-gray-700">Privacy Policy</a>
          <a href="#" className="hover:text-gray-700">Your Privacy Choices</a>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          © Copyright 2024 FiBi LLC. All rights reserved.
        </p>
      </div>

      {/* Budget Settings Modal */}
      <BudgetSettingsModal
        isOpen={isBudgetSettingsOpen}
        onClose={() => setIsBudgetSettingsOpen(false)}
      />
    </div>
  );
};

export default Settings; 