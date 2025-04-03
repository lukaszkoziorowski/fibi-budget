import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import type { User } from '../types/user';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const saveUserToFirestore = async (userId: string, userData: Partial<User>) => {
    try {
      // Create a clean user object without undefined values
      const userDataToSave = {
        id: userData.id,
        email: userData.email,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        ...(userData.displayName && { displayName: userData.displayName }),
        ...(userData.photoURL && { photoURL: userData.photoURL })
      };

      await setDoc(doc(db, 'users', userId), userDataToSave);
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  };

  const getErrorMessage = (error: any) => {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please log in or use a different email.';
      case 'auth/invalid-email':
        return 'Invalid email address format.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      default:
        return error.message || 'An error occurred during signup. Please try again.';
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please provide both email and password');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Starting email signup process...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Signup successful:', userCredential.user.uid);
      
      const { user } = userCredential;

      console.log('Saving user data to Firestore...');
      await saveUserToFirestore(user.uid, {
        id: user.uid,
        email: user.email || '',
        displayName: user.displayName || null,
        photoURL: user.photoURL || null
      });
      console.log('User data saved successfully');

      // Wait a moment for Firebase to process the registration
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Redirecting to transactions page...');
      navigate('/transactions');
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setIsLoading(true);

    try {
      console.log('Starting Google signup process...');
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log('Google signup successful:', result.user.uid);
      
      const { user } = result;

      console.log('Saving Google user data to Firestore...');
      await saveUserToFirestore(user.uid, {
        id: user.uid,
        email: user.email || '',
        displayName: user.displayName || null,
        photoURL: user.photoURL || null
      });
      console.log('Google user data saved successfully');

      // Wait a moment for Firebase to process the registration
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Redirecting to transactions page...');
      navigate('/transactions');
    } catch (error: any) {
      console.error('Google signup error:', error);
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
          {/* SignUp form card */}
          <div className="bg-white rounded-lg p-8 shadow-2xl w-full">
            <h2 className="text-2xl font-bold text-center mb-2">Sign Up</h2>
            <p className="text-center text-gray-600 mb-6">
              Have an account? <Link to="/login" className="text-purple-600 hover:underline">Log in</Link>
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleEmailSignUp} className="space-y-4">
              {/* Google signup button */}
              <button
                type="button"
                onClick={handleGoogleSignUp}
                className="w-full border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor"/>
                </svg>
                {isLoading ? 'Creating account...' : 'Continue with Google'}
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

              {/* Terms checkbox */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-600">
                    I agree to the <a href="#" className="text-purple-600 hover:underline">Terms of Service</a> and <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a>.
                  </label>
                </div>
              </div>

              {/* SignUp button */}
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
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

export default SignUp; 