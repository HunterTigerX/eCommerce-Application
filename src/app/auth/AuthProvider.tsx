import { createContext, useState, type ReactNode } from 'react';

interface User {
  username: string;
  password: string;
}

interface AuthProviderValue {
  user: User | null;
  signIn: () => void;
  signUp: () => void;
  signOut: () => void;
}

const defaultValue: AuthProviderValue = {
  user: null,
  signIn: () => {},
  signUp: () => {},
  signOut: () => {},
};

export const AuthContext = createContext<AuthProviderValue>(defaultValue);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const signIn = () => {
    setUser({ username: 'test@gmail.com', password: 'test' });
  };

  const signUp = () => {
    setUser({ username: 'test@gmail.com', password: 'test' });
  };

  const signOut = () => {
    setUser(null);
  };

  const value = {
    user,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider };
