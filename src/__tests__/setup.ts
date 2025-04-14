import { vi } from 'vitest';
import { mockFirebase } from './mocks/firebase';

// Mock Firebase
vi.mock('../config/firebase', () => ({
  app: mockFirebase.app,
  auth: mockFirebase.auth,
  analytics: mockFirebase.analytics
}));

vi.mock('@firebase/app', () => ({
  initializeApp: vi.fn(() => mockFirebase.app),
  getApps: vi.fn(() => [mockFirebase.app]),
  getApp: vi.fn(() => mockFirebase.app)
}));

vi.mock('@firebase/analytics', () => ({
  getAnalytics: vi.fn(() => mockFirebase.analytics),
  logEvent: vi.fn()
}));

vi.mock('@firebase/auth', () => ({
  getAuth: vi.fn(() => mockFirebase.auth),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn()
})); 