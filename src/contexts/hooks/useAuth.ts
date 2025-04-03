
import { useState } from 'react';
import db from '@/lib/db';
import { User } from '@/types';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = (pin: string): boolean => {
    const user = db.authenticateUser(pin);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return {
    currentUser,
    login,
    logout
  };
}
