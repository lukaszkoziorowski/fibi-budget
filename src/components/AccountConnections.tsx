import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';

const AccountConnections = () => {
  const navigate = useNavigate();
  
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

      <h1 className="text-3xl font-bold mb-8">Manage Connections</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
        <p className="text-gray-500">This feature is coming soon. You'll be able to connect your accounts from various financial institutions.</p>
      </div>
    </div>
  );
};

export default AccountConnections; 