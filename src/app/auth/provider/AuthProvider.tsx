import { createContext, type ReactNode, useState } from 'react';
import type { UserAuthOptions } from '@commercetools/sdk-client-v2/dist/declarations/src/types/sdk';
import type { Customer, MyCustomerDraft } from '@commercetools/platform-sdk';
import { AuthService, type AuthResponse } from '@app/auth/service';

const authService = new AuthService();
await authService.init();

interface AuthProviderValue {
  user: Customer | null;
  signIn: (credentials: UserAuthOptions) => Promise<AuthResponse>;
  signUp: (credentials: MyCustomerDraft) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthProviderValue>({
  user: authService.user,
  signIn: () => Promise.resolve({ success: false, message: '' }),
  signUp: () => Promise.resolve({ success: false, message: '' }),
  signOut: () => Promise.resolve(),
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [customer, setCustomer] = useState<Customer | null>(authService.user);

  const signIn = async (credentials: UserAuthOptions): Promise<AuthResponse> => {
    const result: AuthResponse = await authService.signIn(credentials);

    if (result.success) setCustomer(result.data);

    return result;
  };

  const signUp = async (credentials: MyCustomerDraft): Promise<AuthResponse> => {
    const result: AuthResponse = await authService.signUp(credentials);

    if (result.success) setCustomer(result.data);

    return result;
  };

  const signOut = async (): Promise<void> => {
    await authService.signOut();

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
