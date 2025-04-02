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
      console.log('User created successfully:', userCredential.user.uid);
      
      const { user } = userCredential;

      console.log('Saving user data to Firestore...');
      await saveUserToFirestore(user.uid, {
        id: user.uid,
        email: user.email || '',
        displayName: user.displayName || null,
        photoURL: user.photoURL || null
      });
      console.log('User data saved successfully');

      // Wait a moment for Firebase to process the authentication
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Redirecting to dashboard...');
      navigate('/');
    } catch (error: any) {
      console.error('Detailed signup error:', error);
      setError(getErrorMessage(error));
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
      console.log('Google sign in successful:', result.user.uid);
      
      const { user } = result;

      console.log('Saving Google user data to Firestore...');
      await saveUserToFirestore(user.uid, {
        id: user.uid,
        email: user.email || '',
        displayName: user.displayName || null,
        photoURL: user.photoURL || null
      });
      console.log('Google user data saved successfully');

      // Wait a moment for Firebase to process the authentication
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Redirecting to dashboard...');
      navigate('/');
    } catch (error: any) {
      console.error('Detailed Google signup error:', error);
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (error: any) => {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Please log in instead.';
      case 'auth/invalid-email':
        return 'Invalid email address format.';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled. Please contact support.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use a stronger password.';
      default:
        return error.message || 'An error occurred during sign up.';
    }
  };

  return (
    <div className="min-h-screen bg-indigo-900 flex flex-col">
      {/* Logo in top-left corner */}
      <div className="p-6">
        <Link to="/" className="text-2xl font-bold text-white">Fibi Budget</Link>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-between px-6 lg:px-20">
        {/* Left side content */}
        <div className="text-white max-w-lg">
          <div className="mb-8">
            <svg className="w-16 h-16 text-white mb-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" fill="currentColor"/>
            </svg>
            <h1 className="text-4xl font-bold mb-4">Try Fibi Budget free for 34 days</h1>
            <p className="text-xl text-indigo-200">
              The average Fibi Budget user saves $600 in their first two
              months (and you seem above average, honestly).
            </p>
          </div>
        </div>

        {/* Sign Up form card */}
        <div className="bg-white rounded-lg p-8 shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-2">Sign Up</h2>
          <p className="text-center text-gray-600 mb-6">
            Have an account? <Link to="/login" className="text-blue-600 hover:underline">Log in</Link>
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailSignUp} className="space-y-4">
            {/* Email input */}
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Email address"
                required
                disabled={isLoading}
              />
            </div>

            {/* Password input */}
            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            {/* Sign Up button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Signing up...' : 'Sign Up'}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Social sign up buttons */}
            <button
              type="button"
              className="w-full border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 mb-3 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" fill="currentColor"/>
              </svg>
              Continue with Apple
            </button>
            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="w-full border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor"/>
              </svg>
              {isLoading ? 'Signing up...' : 'Continue with Google'}
            </button>
          </form>

          <p className="mt-6 text-xs text-gray-500 text-center">
            By creating an account, you agree to the Fibi Budget{' '}
            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
            {' '}and{' '}
            <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="py-4 px-6 text-center text-indigo-200 text-sm">
        <div className="flex justify-center space-x-4">
          <a href="#" className="hover:text-white">Terms of Service</a>
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">California Privacy Policy</a>
          <a href="#" className="hover:text-white">Your Privacy Choices</a>
        </div>
        <div className="mt-2">
          © Copyright 2024 Fibi Budget LLC. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default SignUp; 