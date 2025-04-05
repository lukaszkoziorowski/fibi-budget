import React, { useState } from 'react';
import { XMarkIcon, ArrowLeftIcon, LockClosedIcon, PencilIcon, EyeIcon, UserIcon, ShieldCheckIcon, KeyIcon } from '@heroicons/react/24/outline';
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
  const [activeSection, setActiveSection] = useState<'login' | 'security' | 'personal'>('login');

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

  const renderContent = () => {
    switch(activeSection) {
      case 'login':
        return (
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-5">
              <h2 className="text-2xl font-semibold">Login Methods</h2>
              <p className="text-gray-500 mt-1">Manage your login methods and password</p>
            </div>

            {/* Email Section */}
            <div className="border-b border-gray-200 pb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium mb-1">Email</h3>
                  <p className="text-gray-500 text-sm mb-1">{currentUser?.email}</p>
                  <p className="text-gray-500 text-sm">Use this email to log in to your account</p>
                </div>
                <button className="text-primary hover:underline">Update</button>
              </div>
            </div>

            {/* Google Connection */}
            <div className="border-b border-gray-200 pb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium mb-1">Google</h3>
                  <p className="text-gray-500 text-sm">
                    Connected as {currentUser?.displayName || currentUser?.email}
                  </p>
                </div>
                <button className="text-primary hover:underline">Disconnect</button>
              </div>
            </div>

            {/* Password Section */}
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium mb-1">Password</h3>
                  <p className="text-gray-500 text-sm">
                    {isShowingPassword 
                      ? "Set a password to secure your account" 
                      : "Add a password for additional security"}
                  </p>
                </div>
                <button 
                  onClick={() => setIsShowingPassword(!isShowingPassword)}
                  className="text-primary hover:underline"
                >
                  {isShowingPassword ? "Cancel" : "Set up"}
                </button>
              </div>

              {isShowingPassword && (
                <div className="mt-4 max-w-lg">
                  <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">New password</label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="Enter new password"
                    />
                  </div>
                  <button 
                    onClick={handleSetPassword}
                    className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors"
                  >
                    Save password
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'security':
        return (
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-5">
              <h2 className="text-2xl font-semibold">Account Security</h2>
              <p className="text-gray-500 mt-1">Manage your security settings and two-step verification</p>
            </div>

            {/* Two-Step Verification */}
            <div className="border-b border-gray-200 pb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium mb-1">Two-step verification</h3>
                  <p className="text-gray-500 text-sm">Add an extra layer of security to your account</p>
                </div>
                <button className="text-primary hover:underline">Set up</button>
              </div>
            </div>

            {/* Login activity */}
            <div className="border-b border-gray-200 pb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium mb-1">Login activity</h3>
                  <p className="text-gray-500 text-sm">View your recent login activity</p>
                </div>
                <button className="text-primary hover:underline">View</button>
              </div>
            </div>
          </div>
        );
      
      case 'personal':
      default:
        return (
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-5">
              <h2 className="text-2xl font-semibold">Personal Information</h2>
              <p className="text-gray-500 mt-1">Update your personal details and preferences</p>
            </div>

            {/* Profile info */}
            <div className="border-b border-gray-200 pb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium mb-1">Name</h3>
                  <p className="text-gray-500 text-sm">
                    {currentUser?.displayName || "Not provided"}
                  </p>
                </div>
                <button className="text-primary hover:underline">Edit</button>
              </div>
            </div>

            {/* Email address */}
            <div className="border-b border-gray-200 pb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium mb-1">Email</h3>
                  <p className="text-gray-500 text-sm">{currentUser?.email}</p>
                </div>
                <button className="text-primary hover:underline">Edit</button>
              </div>
            </div>

            {/* Contact info */}
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium mb-1">Phone number</h3>
                  <p className="text-gray-500 text-sm">Not provided</p>
                </div>
                <button className="text-primary hover:underline">Add</button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-4">
        {/* Breadcrumb navigation */}
        <div className="mb-4">
          <div className="flex items-center text-gray-600 text-sm py-4">
            <span className="cursor-pointer hover:text-gray-800" onClick={() => navigate('/settings')}>Settings</span>
            <span className="mx-2">›</span>
            <span className="font-medium text-gray-800">Account Settings</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">{currentUser?.displayName || 'User'}</p>
                    <p className="text-sm text-gray-500 truncate">{currentUser?.email}</p>
                  </div>
                </div>
              </div>
              
              <nav className="py-2">
                <ul>
                  <li>
                    <button 
                      onClick={() => setActiveSection('personal')}
                      className={`w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 
                        ${activeSection === 'personal' ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-700'}`}
                    >
                      <UserIcon className={`h-5 w-5 ${activeSection === 'personal' ? 'text-purple-700' : 'text-gray-500'}`} />
                      <span>Personal info</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveSection('login')}
                      className={`w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 
                        ${activeSection === 'login' ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-700'}`}
                    >
                      <KeyIcon className={`h-5 w-5 ${activeSection === 'login' ? 'text-purple-700' : 'text-gray-500'}`} />
                      <span>Login & authentication</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveSection('security')}
                      className={`w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 
                        ${activeSection === 'security' ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-700'}`}
                    >
                      <ShieldCheckIcon className={`h-5 w-5 ${activeSection === 'security' ? 'text-purple-700' : 'text-gray-500'}`} />
                      <span>Security</span>
                    </button>
                  </li>
                </ul>
              </nav>
              
              <div className="p-4 border-t border-gray-200">
                <button 
                  onClick={handleLogout}
                  className="w-full text-left text-primary text-sm hover:underline"
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings; 