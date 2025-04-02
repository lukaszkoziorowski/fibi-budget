import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

const AccountSettings = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isShowingPassword, setIsShowingPassword] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleSetPassword = () => {
    // This functionality would be implemented with Firebase's updatePassword
    console.log('Setting password:', password);
    setPassword('');
    setIsShowingPassword(false);
  };

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

      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div>
            <p className="text-gray-500">{currentUser?.email}</p>
            <a href="#" className="text-primary text-sm hover:underline" onClick={() => handleLogout()}>Log Out</a>
          </div>
        </div>
      </div>

      {/* Login Methods Section */}
      <h2 className="text-xl font-semibold mb-4">Login Methods</h2>

      {/* Password Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Set a Password</h3>
          <p className="text-gray-500 text-sm">
            Optionally set a password to enable an additional login method, or to edit your account email.
          </p>
        </div>

        {isShowingPassword ? (
          <div className="mt-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-gray-500">{currentUser?.email}</p>
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Enter new password"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button 
                onClick={handleSetPassword}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
              >
                Set Password
              </button>
              <button 
                onClick={() => setIsShowingPassword(false)}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsShowingPassword(true)}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            Set Password
          </button>
        )}
      </div>

      {/* Google Connection */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor"/>
            </svg>
            <div>
              <h3 className="font-medium">Google</h3>
              <p className="text-sm text-gray-500">{currentUser?.displayName || currentUser?.email}</p>
            </div>
          </div>
          <button className="text-primary text-sm hover:underline">Disconnect</button>
        </div>
      </div>

      {/* Apple Option */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" fill="currentColor"/>
            </svg>
            <h3 className="font-medium">Apple</h3>
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">Connect</button>
        </div>
      </div>

      {/* Two-Step Verification */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Two-Step Verification</h3>
            <p className="text-sm text-gray-500">
              Increase your login security by adding a second method of login.
              <a href="#" className="text-primary ml-1 hover:underline">Learn more</a>
            </p>
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">Set Up</button>
        </div>
      </div>

      {/* Footer section with links */}
      <div className="py-4 border-t border-gray-200 mt-6">
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <a href="#" className="hover:text-gray-700">Terms of Service</a>
          <a href="#" className="hover:text-gray-700">Privacy Policy</a>
          <a href="#" className="hover:text-gray-700">Your Privacy Choices</a>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          © Copyright 2024 FiBi LLC. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AccountSettings; 