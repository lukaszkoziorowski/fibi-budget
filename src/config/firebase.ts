import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJlaYFn_bzUt5iBmUyVOezVhA3ZeSMNZc",
  authDomain: "fibi-b0661.firebaseapp.com",
  projectId: "fibi-b0661",
  storageBucket: "fibi-b0661.appspot.com",
  messagingSenderId: "611218402699",
  appId: "1:611218402699:web:2deba867033f643d1b538e",
  measurementId: "G-1G7TV4CN0D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics
export const analytics = getAnalytics(app);

// Get Auth instance
export const auth = getAuth(app);

// Get Firestore instance
export const db = getFirestore(app);

export default app; 