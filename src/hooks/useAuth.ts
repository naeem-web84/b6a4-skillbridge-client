// hooks/useAuth.ts
'use client';

import { useState, useEffect } from 'react';
import { getUserInfo, isAuthenticated } from '@/app/actions/user.actions';

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const userInfo = await getUserInfo();
        
        if (userInfo.authenticated && userInfo.user) {
          setUser(userInfo.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { user, isLoading };
};