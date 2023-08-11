import { createContext, type ReactNode, useState } from 'react';
import { Customer } from '@commercetools/platform-sdk';
import { AuthResponse, UserSignInCredentials, UserSignUpCredentials } from '@types';
import { User } from '@entities/user';

const user = new User();
await user.init();

interface AuthProviderValue {
  user: Customer | null;
  signIn: (credentials: UserSignInCredentials) => Promise<AuthResponse>;
  signUp: (credentials: UserSignUpCredentials) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthProviderValue>({
  user: user.data,
  signIn: () => Promise.resolve({ success: false, message: '' }),
  signUp: () => Promise.resolve({ success: false, message: '' }),
  signOut: () => Promise.resolve(),
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [customer, setCustomer] = useState<Customer | null>(user.data);

  const signIn = async (credentials: UserSignInCredentials): Promise<AuthResponse> => {
    const result: AuthResponse = await user.signIn(credentials);

    if (result.success) setCustomer(result.data);

    return result;
  };

  const signUp = async (credentials: UserSignUpCredentials): Promise<AuthResponse> => {
    const result: AuthResponse = await user.signUp(credentials);

    if (result.success) setCustomer(result.data);

    return result;
  };

  const signOut = async (): Promise<void> => {
    await user.signOut();

    setCustomer(null);
  };

  const value: AuthProviderValue = {
    user: customer,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider };
