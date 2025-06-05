import React, { createContext, useContext, useState } from 'react';

interface User {
  id: number;
  name: string;
  pin: string;
}

interface Shift {
  id: number;
  userId: number;
  startTime: Date;
  endTime?: Date;
  startFloat: number;
  endCash?: number;
}

interface AppContextType {
  currentUser: User | null;
  currentShift: Shift | null;
  currentMode: 'till' | 'restaurant';
  login: (pin: string) => boolean;
  logout: () => void;
  startShift: (userId: number, startFloat: number) => void;
  endShift: () => void;
  toggleMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

const mockUsers: User[] = [
  { id: 1, name: "John Doe", pin: "55" },
  { id: 2, name: "Jane Smith", pin: "55" },
  { id: 3, name: "Alice Johnson", pin: "55" },
  { id: 4, name: "Bob Williams", pin: "55" },
];

const initialShiftData: Shift[] = [];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentShift, setCurrentShift] = useState<Shift | null>(null);
  const [currentMode, setCurrentMode] = useState<'till' | 'restaurant'>('till');

  const login = (pin: string): boolean => {
    const user = mockUsers.find(user => user.pin === pin);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentShift(null);
  };

  const startShift = (userId: number, startFloat: number) => {
    const newShift: Shift = {
      id: initialShiftData.length + 1,
      userId: userId,
      startTime: new Date(),
      startFloat: startFloat,
    };
    setCurrentShift(newShift);
  };

  const endShift = () => {
    setCurrentShift(null);
  };

  const toggleMode = () => {
    setCurrentMode(prev => prev === 'till' ? 'restaurant' : 'till');
  };

  const value: AppContextType = {
    currentUser,
    currentShift,
    currentMode,
    login,
    logout,
    startShift,
    endShift,
    toggleMode,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
