import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../config/firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const getErrorMessage = (error: any) => {
    switch (error.code) {
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please check your credentials and try again.';
      case 'auth/user-not-found':
        return 'No account found with this email. Please sign up first.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/invalid-email':
        return 'Invalid email address format.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      default:
        return error.message || 'An error occurred during login. Please try again.';
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please provide both email and password');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Starting email login process...');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful:', userCredential.user.uid);

      // Wait a moment for Firebase to process the authentication
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Redirecting to transactions page...');
      navigate('/transactions');
    } catch (error: any) {
      console.error('Login error:', error);
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);

    try {
      console.log('Starting Google login process...');
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log('Google login successful:', result.user.uid);

      // Wait a moment for Firebase to process the authentication
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Redirecting to transactions page...');
      navigate('/transactions');
    } catch (error: any) {
      console.error('Google login error:', error);
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Two-tone background - Purple top, white bottom */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-x-0 top-0 h-1/3 bg-[#58009F]"></div>
        <div className="absolute inset-x-0 top-1/3 bottom-0 bg-white"></div>
      </div>

      {/* Logo centered above the form */}
      <div className="flex justify-center p-6 relative z-10">
        <Link to="/landing">
          <img src="/logo-white.svg" alt="FiBi" className="h-8" />
        </Link>
      </div>

      {/* Main content - Positioned more toward the top */}
      <div className="flex-1 flex items-start justify-center px-6 lg:px-20 relative z-10 mt-4">
        <div className="w-full flex flex-col items-center justify-center max-w-md mx-auto">
          {/* Login form card */}
          <div className="bg-white rounded-lg p-8 shadow-2xl w-full">
            <h2 className="text-2xl font-bold text-center mb-2">Log In</h2>
            <p className="text-center text-gray-600 mb-6">
              New to Fibi Budget? <Link to="/signup" className="text-purple-600 hover:underline">Sign up today</Link>
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleEmailLogin} className="space-y-4">
              {/* Google login button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor"/>
                </svg>
                {isLoading ? 'Logging in...' : 'Continue with Google'}
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Email input */}
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Email address"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password input */}
              <div className="relative">
                <label htmlFor="password" className="sr-only">Password</label>
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Password"
                  required
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <input
                    type="checkbox"
                    id="showPassword"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    className="h-4 w-4 text-purple-600 border-gray-300 rounded"
                  />
                  <label htmlFor="showPassword" className="ml-2 text-sm text-gray-600">Show</label>
                </div>
              </div>

              {/* Remember me and Forgot password */}
              <div className="flex justify-between items-center">
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-2 text-sm text-gray-600">Keep me logged in</span>
                </label>
                <a href="#" className="text-sm text-purple-600 hover:underline">
                  Forgot password?
                </a>
              </div>

              {/* Login button */}
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Log In'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-4 px-6 text-center text-gray-600 text-sm relative z-10">
        <div className="flex flex-wrap justify-center space-x-4">
          <a href="#" className="hover:text-purple-700">Terms of Service</a>
          <a href="#" className="hover:text-purple-700">Privacy Policy</a>
          <a href="#" className="hover:text-purple-700">Your Privacy Choices</a>
        </div>
        <div className="mt-2">
          © Copyright 2024 Fibi Budget LLC. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login; 