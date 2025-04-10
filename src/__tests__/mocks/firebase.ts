import { vi } from 'vitest';

const mockApp = {
  name: '[DEFAULT]',
  options: {},
  automaticDataCollectionEnabled: false
};

const mockAuth = {
  currentUser: null,
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn()
};

const mockAnalytics = {
  app: mockApp,
  logEvent: vi.fn()
};

export const mockFirebase = {
  app: mockApp,
  auth: mockAuth,
  analytics: mockAnalytics
}; 