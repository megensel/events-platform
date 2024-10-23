import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AuthState, User } from '../types';
import { saveAuth, loadAuth, saveUsers, loadUsers } from '../utils/storage';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const stored = loadAuth();
    return stored || { user: null, isAuthenticated: false };
  });

  useEffect(() => {
    saveAuth(authState);
  }, [authState]);

  const login = async (email: string, password: string) => {
    const users = loadUsers();
    const user = users.find(u => u.email === email);
    
    if (user) {
      // Update last login
      const updatedUser = { ...user, lastLogin: new Date().toISOString() };
      saveUsers(users.map(u => u.id === user.id ? updatedUser : u));
      setAuthState({ user: updatedUser, isAuthenticated: true });
    } else {
      // Create new user on first login
      const newUser: User = {
        id: crypto.randomUUID(),
        name: email.split('@')[0],
        email,
        isAdmin: email.includes('admin'),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      saveUsers([...users, newUser]);
      setAuthState({ user: newUser, isAuthenticated: true });
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const users = loadUsers();
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      isAdmin: email.includes('admin'),
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);
    setAuthState({ user: newUser, isAuthenticated: true });
  };

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}