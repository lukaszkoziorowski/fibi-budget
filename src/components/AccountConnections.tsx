import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Footer from './Footer';

const AccountConnections = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-4">
          {/* Breadcrumb navigation */}
          <div className="mb-4">
            <div className="flex items-center text-gray-600 text-sm py-4">
              <Link to="/settings" className="cursor-pointer hover:text-gray-800">Settings</Link>
              <span className="mx-2">›</span>
              <span className="font-medium text-gray-800">Manage Connections</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-8">Manage Connections</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 mb-6">
            <p className="text-gray-500">This feature is coming soon. You'll be able to connect your accounts from various financial institutions.</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AccountConnections; 