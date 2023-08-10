import { createContext, type ReactNode, useState } from 'react';
import { Customer } from '@commercetools/platform-sdk';
import { User } from '@entities/user';

const user = new User();
await user.init();

interface AuthProviderValue {
  user: Customer | null;
  signIn: (credentials: { username: string; password: string }) => void;
  signUp: (credentials: { firstName: string; lastName: string; email: string; password: string }) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthProviderValue>({
  user: null,
  signIn: () => {},
  signUp: () => {},
  signOut: () => {},
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [customer, setCustomer] = useState<Customer | null>(user.data);

  const signIn = (credentials: { username: string; password: string }): void => {
    user.signIn(credentials).then((data: Customer) => setCustomer(data));
  };

  const signUp = (credentials: { firstName: string; lastName: string; email: string; password: string }): void => {
    user.signUp(credentials).then((data: Customer) => setCustomer(data));
  };

  const signOut = (): void => {
    user.signOut().then(() => setCustomer(null));
  };

  const value = {
    user: customer,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider };
