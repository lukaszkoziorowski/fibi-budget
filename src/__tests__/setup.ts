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

// Mock currency hooks
vi.mock('@/hooks/useCurrency', () => ({
  useCurrency: () => ({
    currencyFormat: {
      placement: 'before',
      currency: 'USD',
      locale: 'en-US',
      numberFormat: {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      },
      dateFormat: 'MM/dd/yyyy'
    },
    currencySymbol: '$'
  })
}));

vi.mock('@/hooks/useExchangeRates', () => ({
  useExchangeRates: () => ({
    convertAmount: (amount: number) => amount
  })
}));

// Mock drag and drop events
const mockDragEvent = {
  dataTransfer: {
    setData: vi.fn(),
    getData: vi.fn(() => 'test-id'),
    effectAllowed: '',
    dropEffect: ''
  },
  preventDefault: vi.fn(),
  currentTarget: {
    classList: {
      add: vi.fn(),
      remove: vi.fn()
    }
  }
};

global.DragEvent = class DragEvent extends Event {
  dataTransfer = mockDragEvent.dataTransfer;
  constructor() {
    super('drag');
  }
} as any; 