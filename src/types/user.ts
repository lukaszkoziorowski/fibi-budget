export interface User {
  id: string;
  email: string;
  createdAt: string;
  lastLoginAt: string;
  displayName?: string | null;
  photoURL?: string | null;
} 