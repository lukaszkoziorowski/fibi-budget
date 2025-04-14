import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement actual authentication logic
    // For now, just mock a user
    setUser({
      id: '1',
      email: 'test@example.com',
      name: 'Test User'
    });
    setLoading(false);
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user
  };
} 
 
 
 
 
 
 